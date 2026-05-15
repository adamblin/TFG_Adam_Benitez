import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  PageShell,
  Button,
  DurationSelector,
  SectionLabel,
} from '../../src/shared/components';
import { colors, spacing } from '../../src/shared/theme';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { FocusTimerCard } from '../../src/features/focus/components/FocusTimerCard';
import { TaskAccordionSelector } from '../../src/features/focus/components/TaskAccordionSelector';
import { useFocusSession } from '../../src/features/focus/hooks/useFocusSession';

export default function FocusScreen() {
  const params = useLocalSearchParams<{ taskId?: string | string[] }>();
  const initialTaskId = typeof params.taskId === 'string' ? params.taskId : null;
  const [selectedSubtaskId, setSelectedSubtaskId] = useState<string | null>(null);

  const {
    selectedTaskId,
    setSelectedTaskId,
    selectedDuration,
    selectDuration,
    secondsLeft,
    isRunning,
    isStarted,
    isLoading,
    formattedTime,
    progressPercent,
    startSession,
    togglePauseResume,
    stopSession,
  } = useFocusSession({ initialTaskId });

  const { data: tasks = [] } = useTasks();
  const durations = [5, 10, 25, 45];

  const tasksWithSubtasks = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed)
        .map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          dueDate: task.dueDate ?? null,
          subtasks: task.subtasks.map((s) => ({ id: s.id, title: s.title, completed: s.completed })),
        })),
    [tasks]
  );

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const selectedSubtask = selectedSubtaskId
    ? tasksWithSubtasks
        .find((t) => t.id === selectedTaskId)
        ?.subtasks.find((st) => st.id === selectedSubtaskId)
    : null;

  const statusText = useMemo(() => {
    if (!isStarted) return `Ready for ${selectedDuration} minutes`;
    if (isRunning) {
      if (selectedSubtask) return `Focusing on ${selectedSubtask.title}`;
      if (selectedTask) return `Focusing on ${selectedTask.title}`;
      return 'Focusing...';
    }
    if (secondsLeft === 0) return 'Session completed';
    return 'Session paused';
  }, [isRunning, isStarted, secondsLeft, selectedTask, selectedSubtask, selectedDuration]);

  return (
    <PageShell>
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ color: colors.text, fontSize: 36, fontWeight: '900', marginBottom: spacing.xs }}>
          Focus Mode
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500' }}>
          Select a task and start focusing
        </Text>
      </View>

      <SectionLabel>SELECT THE TASK</SectionLabel>
      <View style={{ marginBottom: spacing.lg, opacity: isStarted ? 0.5 : 1 }}>
        <TaskAccordionSelector
          tasks={tasksWithSubtasks}
          selectedTaskId={selectedTaskId}
          selectedSubtaskId={selectedSubtaskId}
          onSelectTask={isStarted ? () => {} : setSelectedTaskId}
          onSelectSubtask={
            isStarted ? () => {} : (subtaskId) => setSelectedSubtaskId(subtaskId)
          }
        />
      </View>

      <SectionLabel>DURATION</SectionLabel>
      <View style={{ marginBottom: spacing.lg, opacity: isStarted ? 0.5 : 1 }}>
        <DurationSelector
          durations={durations}
          selectedDuration={selectedDuration}
          onSelect={isStarted ? () => {} : selectDuration}
        />
      </View>

      <SectionLabel>TIMER</SectionLabel>
      <View style={{ marginBottom: spacing.lg }}>
        <FocusTimerCard
          formattedTime={formattedTime}
          statusText={statusText}
          progressPercent={progressPercent}
        />
      </View>

      <View style={{ marginBottom: spacing.lg }}>
        <Button
          label={isLoading ? 'Starting...' : 'Start Focus Session'}
          variant="primary"
          onPress={() => { void startSession(); }}
          disabled={isRunning || isLoading || isStarted}
        />
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
          <Button
            label={isRunning ? 'Pause' : 'Resume'}
            variant="secondary"
            onPress={togglePauseResume}
            disabled={!isStarted || secondsLeft === 0}
            style={{ flex: 1 }}
          />
          <Button
            label="Stop"
            variant="secondary"
            onPress={() => { void stopSession(); }}
            disabled={!isStarted}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </PageShell>
  );
}
