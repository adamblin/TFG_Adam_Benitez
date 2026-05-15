import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PageShell } from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { useCreateTask } from '../../src/features/tasks/hooks/useCreateTask';
import { useDeleteTask } from '../../src/features/tasks/hooks/useDeleteTask';
import { useDeleteSubtask } from '../../src/features/tasks/hooks/useDeleteSubtask';
import { useToggleSubtask } from '../../src/features/tasks/hooks/useToggleSubtask';
import { useCreateSubtask } from '../../src/features/tasks/hooks/useCreateSubtask';
import { useUpdateTask } from '../../src/features/tasks/hooks/useUpdateTask';
import { TaskAccordionCard, TaskComposerCard } from '../../src/features/tasks/components';
import { styles } from './styles';
import { colors, spacing } from '../../src/shared/theme';
import { computeRisk, RISK_CONFIG, RISK_ORDER } from '../../src/shared/utils/taskRisk';

// ─────────────────────────────────────────────────────────────────────────────

export default function TasksScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);

  const { data: tasks = [], isError } = useTasks();
  const { mutateAsync: createTask }   = useCreateTask();
  const { mutate: deleteTask }        = useDeleteTask();
  const { mutate: deleteSubtask }     = useDeleteSubtask();
  const { mutate: toggleSubtask }     = useToggleSubtask();
  const { mutateAsync: createSubtask } = useCreateSubtask();
  const { mutate: updateTask }        = useUpdateTask();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeTasks    = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    const completedDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
    return completedDate >= sevenDaysAgo;
  });

  const prevCompletedCount = useRef(completedTasks.length);
  useEffect(() => {
    if (completedTasks.length > prevCompletedCount.current) {
      setCompletedOpen(true);
    }
    prevCompletedCount.current = completedTasks.length;
  }, [completedTasks.length]);

  const handleAutoSubmit = async (title: string, dueDate: string | null) => {
    setIsSubmitting(true);
    try {
      await createTask({ title, ...(dueDate ? { dueDate } : {}) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (title: string, subtaskTitles: string[], dueDate: string | null) => {
    setIsSubmitting(true);
    try {
      const task = await createTask({ title, ...(dueDate ? { dueDate } : {}) });
      for (const subtaskTitle of subtaskTitles) {
        await createSubtask({ taskId: task.id, title: subtaskTitle });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert('Delete task', 'Do you want to remove this task from the list?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
    ]);
  };

  if (isError) {
    return (
      <PageShell>
        <Text style={{ color: colors.error }}>Error loading tasks</Text>
      </PageShell>
    );
  }

  const sortedActive = [...activeTasks].sort((a, b) => {
    const riskDiff = RISK_ORDER[computeRisk(a)] - RISK_ORDER[computeRisk(b)];
    if (riskDiff !== 0) return riskDiff;
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.slice(0, 10).localeCompare(b.dueDate.slice(0, 10));
  });

  return (
    <PageShell>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>
          Break down your tasks and keep everything under control.
        </Text>
      </View>

      <TaskComposerCard
        onAutoSubmit={handleAutoSubmit}
        onManualSubmit={handleManualSubmit}
        isLoading={isSubmitting}
      />

      {tasks.length === 0 ? (
        <Text style={styles.emptyState}>No tasks yet. Create one to get started!</Text>
      ) : (
        <View style={styles.list}>
          {/* ── Active tasks ── */}
          {sortedActive.length === 0 && completedTasks.length > 0 && (
            <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', marginBottom: spacing.lg }}>
              All caught up! 🎉
            </Text>
          )}

          {sortedActive.map((task, index) => {
            const risk = computeRisk(task);
            const { label: priorityLabel, color: accentColor } = RISK_CONFIG[risk];
            return (
              <TaskAccordionCard
                key={task.id}
                taskId={task.id}
                title={task.title}
                priorityLabel={priorityLabel}
                dueDate={task.dueDate ?? null}
                accentColor={accentColor}
                subtasks={(task.subtasks ?? []).map((s) => ({
                  id: s.id,
                  title: s.title,
                  completed: s.completed,
                }))}
                defaultExpanded={index === 0}
                onFocusPress={() => router.push(`/focus?origin=tasks&taskId=${task.id}`)}
                onDeletePress={() => handleDeleteTask(task.id)}
                onDeleteSubtask={(subtaskId) => deleteSubtask({ taskId: task.id, subtaskId })}
                onToggleSubtask={(subtaskId, completed) =>
                  toggleSubtask({ taskId: task.id, subtaskId, completed })
                }
                onDueDateChange={(date) =>
                  updateTask({ taskId: task.id, data: { dueDate: date ?? undefined } })
                }
              />
            );
          })}

          {/* ── Completed section ── */}
          {completedTasks.length > 0 && (
            <View style={{ marginTop: sortedActive.length > 0 ? spacing.md : 0 }}>
              <Pressable
                onPress={() => setCompletedOpen((v) => !v)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.xs,
                  marginBottom: completedOpen ? spacing.sm : 0,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 }}>
                    COMPLETED
                  </Text>
                  <View style={{
                    backgroundColor: `${colors.success}22`,
                    borderRadius: 99,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                    <Text style={{ color: colors.success, fontSize: 11, fontWeight: '800' }}>
                      {completedTasks.length}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 16 }}>
                  {completedOpen ? '∧' : '∨'}
                </Text>
              </Pressable>

              {completedOpen && completedTasks.map((task) => (
                <View key={task.id} style={{ opacity: 0.55, marginBottom: spacing.sm }}>
                  <TaskAccordionCard
                    taskId={task.id}
                    title={task.title}
                    priorityLabel="Done"
                    dueDate={task.dueDate ?? null}
                    accentColor={colors.success}
                    subtasks={(task.subtasks ?? []).map((s) => ({
                      id: s.id,
                      title: s.title,
                      completed: s.completed,
                    }))}
                    defaultExpanded={false}
                    onFocusPress={() => {}}
                    onDeletePress={() => handleDeleteTask(task.id)}
                    onDeleteSubtask={(subtaskId) => deleteSubtask({ taskId: task.id, subtaskId })}
                    onToggleSubtask={(subtaskId, completed) =>
                      toggleSubtask({ taskId: task.id, subtaskId, completed })
                    }
                    onDueDateChange={(date) =>
                      updateTask({ taskId: task.id, data: { dueDate: date ?? undefined } })
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </PageShell>
  );
}
