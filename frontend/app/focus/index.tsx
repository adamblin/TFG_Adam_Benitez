import React, { useMemo } from 'react';
import { Alert, Text } from 'react-native';
import {
  PageShell,
  Card,
  SectionLabel,
  TaskSelector,
  DurationSelector,
} from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { FocusTimerCard } from '../../src/features/focus/components/FocusTimerCard';
import { FocusTimerControls } from '../../src/features/focus/components/FocusTimerControls';
import { useFocusSession } from '../../src/features/focus/hooks/useFocusSession';
import { styles } from './styles';

export default function FocusScreen() {
  const {
    selectedTaskId,
    setSelectedTaskId,
    selectedDuration,
    selectDuration,
    showTaskDropdown,
    setShowTaskDropdown,
    secondsLeft,
    isRunning,
    isStarted,
    formattedTime,
    progressPercent,
    startSession,
    togglePauseResume,
    stopSession,
  } = useFocusSession({
    onSessionComplete: () => {
      Alert.alert('Focus Session', 'Great work! You completed your focus session.');
    },
  });

  const { data: tasks = [] } = useTasks();

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const durations = [5, 10, 25, 45];

  const handleStartSession = () => {
    if (!selectedTask) {
      Alert.alert('Error', 'Please select a task to focus on');
      return;
    }

    startSession();
  };

  const statusText = useMemo(() => {
    if (!isStarted) {
      return 'Ready to start';
    }

    if (isRunning) {
      return `Focusing on ${selectedTask?.title ?? 'task'}`;
    }

    if (secondsLeft === 0) {
      return 'Session completed';
    }

    return 'Session paused';
  }, [isRunning, isStarted, secondsLeft, selectedTask?.title]);

  return (
    <PageShell>
      <SectionLabel>SELECT THE TASK</SectionLabel>
      <TaskSelector
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelect={setSelectedTaskId}
        isOpen={showTaskDropdown}
        onToggle={() => setShowTaskDropdown(!showTaskDropdown)}
      />

      <SectionLabel>SUBTASK (optional)</SectionLabel>
      <Card style={styles.subtaskCard}>
        <Text style={styles.subtaskText}>Select subtasks...</Text>
      </Card>

      <SectionLabel>ANOTHER TASK</SectionLabel>
      <Card style={styles.anotherTaskCard}>
        <Text style={styles.anotherTaskTitle}>
          Review focus flow
        </Text>
        <Text style={styles.anotherTaskSubtitle}>
          Understand the full flow and optimize
        </Text>
      </Card>

      <SectionLabel>DURATION</SectionLabel>
      <DurationSelector
        durations={durations}
        selectedDuration={selectedDuration}
        onSelect={selectDuration}
      />

      <SectionLabel>TIMER</SectionLabel>
      <FocusTimerCard
        formattedTime={formattedTime}
        statusText={statusText}
        progressPercent={progressPercent}
      />

      <FocusTimerControls
        isRunning={isRunning}
        isStarted={isStarted}
        secondsLeft={secondsLeft}
        onStart={handleStartSession}
        onPauseResume={togglePauseResume}
        onStop={stopSession}
      />
    </PageShell>
  );
}
