import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { colors, spacing } from '../../src/shared/theme';
import {
  PageShell,
  ProgressCard,
  DecomposeForm,
  TaskCard,
  SectionLabel,
} from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { useUpdateTask } from '../../src/features/tasks/hooks/useUpdateTask';
import { useCreateTask } from '../../src/features/tasks/hooks/useCreateTask';

export default function TasksScreen() {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: tasks = [], isError } = useTasks();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();

  const completedTasks = tasks.filter((task) => task.done).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (task: (typeof tasks)[number]) => {
    if (task) {
      updateTask({ ...task, done: !task.done });
    }
  };

  const handleCreateTask = () => {
    const trimmed = newTaskTitle.trim();
    if (trimmed) {
      createTask(trimmed);
      setNewTaskTitle('');
    } else {
      Alert.alert('Error', 'Please enter a title for the task');
    }
  };

  if (isError) {
    return (
      <PageShell>
        <Text style={{ color: colors.error }}>Error loading tasks</Text>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 34, fontWeight: '900', marginBottom: spacing.xs }}>
            Tasks
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm }}>
            Organize and decompose your work
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>test_user</Text>
        </View>
        <View
          style={{
            minWidth: 52,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>{progressPercent}%</Text>
        </View>
      </View>

      <ProgressCard percent={progressPercent} completed={completedTasks} total={totalTasks} label="GENERAL PROGRESS" />

      <SectionLabel>QUICK ACTIONS</SectionLabel>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 80,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
            Decompose with AI
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 80,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
            Clear manually
          </Text>
        </View>
      </View>

      <SectionLabel>DECOMPOSE WITH AI</SectionLabel>
      <DecomposeForm
        taskTitle={newTaskTitle}
        onTaskTitleChange={setNewTaskTitle}
        onSubmit={handleCreateTask}
        isLoading={isCreating}
      />

      <SectionLabel>MY TASKS</SectionLabel>
      {tasks.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: spacing.xl }}>
          No tasks yet. Create one to get started!
        </Text>
      ) : (
        <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              isUpdating={isUpdating}
            />
          ))}
        </View>
      )}
    </PageShell>
  );
}
