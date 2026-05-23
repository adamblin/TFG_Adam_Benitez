import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageShell } from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { useCreateTask } from '../../src/features/tasks/hooks/useCreateTask';
import { useDeleteTask } from '../../src/features/tasks/hooks/useDeleteTask';
import { useDeleteSubtask } from '../../src/features/tasks/hooks/useDeleteSubtask';
import { useToggleSubtask } from '../../src/features/tasks/hooks/useToggleSubtask';
import { useCreateSubtask } from '../../src/features/tasks/hooks/useCreateSubtask';
import { useUpdateTask } from '../../src/features/tasks/hooks/useUpdateTask';
import { useUpdateSubtask } from '../../src/features/tasks/hooks/useUpdateSubtask';
import { TaskAccordionCard, TaskComposerCard } from '../../src/features/tasks/components';
import { useTheme, spacing } from '../../src/shared/theme';
import { computeRisk, makeRiskConfig, RISK_ORDER } from '../../src/shared/utils/taskRisk';
import { breakdownTask } from '../../src/services/tasks.service';

export default function TasksScreen() {
  const colors = useTheme();
  const riskConfig = makeRiskConfig(colors);
  const router = useRouter();
  const { taskId: highlightTaskId } = useLocalSearchParams<{ taskId?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);

  const { data: tasks = [], isError } = useTasks();
  const { mutateAsync: createTask }    = useCreateTask();
  const { mutate: deleteTask }         = useDeleteTask();
  const { mutate: deleteSubtask }      = useDeleteSubtask();
  const { mutate: toggleSubtask }      = useToggleSubtask();
  const { mutateAsync: createSubtask } = useCreateSubtask();
  const { mutate: updateTask }         = useUpdateTask();
  const { mutate: updateSubtask }      = useUpdateSubtask();

  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = useMemo(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), []);
  const activeTasks    = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    const d = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
    return d >= sevenDaysAgo;
  });

  const prevCompletedCount = useRef(completedTasks.length);
  useEffect(() => {
    if (completedTasks.length > prevCompletedCount.current) setCompletedOpen(true);
    prevCompletedCount.current = completedTasks.length;
  }, [completedTasks.length]);

  const handleBreakdown = async (description: string) => {
    try {
      return await breakdownTask(description);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isQuota = msg.includes('429') || msg.toLowerCase().includes('quota') || msg === 'quota_exceeded';
      const isNetwork = msg.startsWith('[network]') || msg.toLowerCase().includes('network request failed');

      const title = isQuota
        ? 'AI quota exceeded'
        : isNetwork
        ? 'Cannot reach the server'
        : 'AI breakdown failed';

      const body = isQuota
        ? 'The Gemini API free-tier limit has been reached.\n\n• Go to aistudio.google.com\n• Create a new API key (new project)\n• Update GEMINI_API_KEY in backend/.env\n• Restart the backend'
        : isNetwork
        ? 'Make sure the backend is running on port 3000 and that your phone and PC are on the same network (or use --tunnel).'
        : 'The AI service returned an unexpected error. Check the backend logs for details.';

      Alert.alert(title, body, [{ text: 'OK' }]);
      return null;
    }
  };

  const handleAutoSubmit = async (title: string, subtaskTitles: string[], dueDate: string | null) => {
    setIsSubmitting(true);
    try {
      const task = await createTask({ title, ...(dueDate ? { dueDate } : {}) });
      await Promise.all(subtaskTitles.map((s) => createSubtask({ taskId: task.id, title: s })));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (title: string, subtaskTitles: string[], dueDate: string | null) => {
    setIsSubmitting(true);
    try {
      const task = await createTask({ title, ...(dueDate ? { dueDate } : {}) });
      for (const s of subtaskTitles) await createSubtask({ taskId: task.id, title: s });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) {
    return (
      <PageShell>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingTop: 80 }}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.error} />
          <Text style={{ color: colors.error, fontSize: 15, fontWeight: '600' }}>Error loading tasks</Text>
        </View>
      </PageShell>
    );
  }

  const sortedActive = [...activeTasks].sort((a, b) => {
    // Highlighted task always first
    if (a.id === highlightTaskId) return -1;
    if (b.id === highlightTaskId) return 1;
    const rd = RISK_ORDER[computeRisk(a)] - RISK_ORDER[computeRisk(b)];
    if (rd !== 0) return rd;
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.slice(0, 10).localeCompare(b.dueDate.slice(0, 10));
  });

  return (
    <PageShell>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            Stay on track
          </Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
            My Tasks
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/stuck')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 99,
            backgroundColor: '#3B82F614',
            borderWidth: 1,
            borderColor: '#3B82F640',
            marginTop: 6,
          }}
        >
          <Ionicons name="shield-half" size={15} color="#3B82F6" />
          <Text style={{ color: '#3B82F6', fontSize: 13, fontWeight: '700' }}>Safe Mode</Text>
        </Pressable>
      </View>

      <TaskComposerCard
        onBreakdown={handleBreakdown}
        onAutoSubmit={handleAutoSubmit}
        onManualSubmit={handleManualSubmit}
        isLoading={isSubmitting}
      />

      {tasks.length === 0 ? (
        /* Empty state */
        <View style={{ alignItems: 'center', paddingVertical: 48, gap: spacing.md }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: `${colors.task}18`,
            borderWidth: 1,
            borderColor: `${colors.task}35`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="add-circle-outline" size={34} color={colors.task} />
          </View>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>No tasks yet</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', maxWidth: 240 }}>
            Create your first task above and break it down with AI
          </Text>
        </View>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {/* All caught up */}
          {sortedActive.length === 0 && completedTasks.length > 0 && (
            <View style={{ alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm }}>
              <Ionicons name="checkmark-circle" size={36} color={colors.riskLow} />
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700' }}>All caught up!</Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>Great work today.</Text>
            </View>
          )}

          {/* Active tasks */}
          {sortedActive.map((task, index) => {
            const risk = computeRisk(task);
            const { label: priorityLabel, color: accentColor } = riskConfig[risk];
            return (
              <TaskAccordionCard
                key={task.id}
                taskId={task.id}
                title={task.title}
                priorityLabel={priorityLabel}
                dueDate={task.dueDate ?? null}
                accentColor={accentColor}
                subtasks={(task.subtasks ?? [])
                  .sort((a, b) => a.order - b.order)
                  .map((s, i) => ({
                    id: s.id,
                    title: s.title,
                    completed: s.completed,
                    ...(i === 0 ? { badge: 'First step' } : {}),
                  }))}
                defaultExpanded={index === 0 || task.id === highlightTaskId}
                onFocusPress={() => router.push(`/focus?origin=tasks&taskId=${task.id}`)}
                onDeletePress={() => deleteTask(task.id)}
                onDeleteSubtask={(sid) => deleteSubtask({ taskId: task.id, subtaskId: sid })}
                onToggleSubtask={(sid, completed) => toggleSubtask({ taskId: task.id, subtaskId: sid, completed })}
                onDueDateChange={(date) => updateTask({ taskId: task.id, data: { dueDate: date ?? undefined } })}
                onUpdateTitle={(t) => updateTask({ taskId: task.id, data: { title: t } })}
                onUpdateSubtask={(sid, t) => updateSubtask({ subtaskId: sid, title: t })}
              />
            );
          })}

          {/* Completed section */}
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
                    backgroundColor: `${colors.riskLow}22`,
                    borderRadius: 99,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                    <Text style={{ color: colors.riskLow, fontSize: 11, fontWeight: '800' }}>
                      {completedTasks.length}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={completedOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textMuted}
                />
              </Pressable>

              {completedOpen && completedTasks.map((task) => (
                <View key={task.id} style={{ opacity: 0.55, marginBottom: spacing.sm }}>
                  <TaskAccordionCard
                    taskId={task.id}
                    title={task.title}
                    priorityLabel="Done"
                    dueDate={task.dueDate ?? null}
                    accentColor={riskConfig.low.color}
                    subtasks={(task.subtasks ?? [])
                      .sort((a, b) => a.order - b.order)
                      .map((s, i) => ({
                        id: s.id,
                        title: s.title,
                        completed: s.completed,
                        ...(i === 0 ? { badge: 'First step' } : {}),
                      }))}
                    defaultExpanded={false}
                    onFocusPress={() => {}}
                    onDeletePress={() => deleteTask(task.id)}
                    onDeleteSubtask={(sid) => deleteSubtask({ taskId: task.id, subtaskId: sid })}
                    onToggleSubtask={(sid, completed) => toggleSubtask({ taskId: task.id, subtaskId: sid, completed })}
                    onDueDateChange={(date) => updateTask({ taskId: task.id, data: { dueDate: date ?? undefined } })}
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
