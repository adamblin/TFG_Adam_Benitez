import React, { useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Text, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  PageShell,
  DurationSelector,
  SectionLabel,
} from '../../src/shared/components';
import { useTheme, spacing } from '../../src/shared/theme';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { FocusTimerCard } from '../../src/features/focus/components/FocusTimerCard';
import { FocusActiveScreen } from '../../src/features/focus/components/FocusActiveScreen';
import { TaskAccordionSelector } from '../../src/features/focus/components/TaskAccordionSelector';
import { useFocusSession } from '../../src/features/focus/hooks/useFocusSession';

export default function FocusScreen() {
  const colors = useTheme();
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
    [tasks],
  );

  const selectedTask    = tasks.find((t) => t.id === selectedTaskId);
  const selectedSubtask = selectedSubtaskId
    ? tasksWithSubtasks.find((t) => t.id === selectedTaskId)?.subtasks.find((st) => st.id === selectedSubtaskId)
    : null;

  useEffect(() => {
    if (!isStarted) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Focus session active',
        'Leaving now will cancel your session. You will not receive XP or coins.',
        [
          { text: 'Keep focusing', style: 'cancel' },
          { text: 'Abandon', style: 'destructive', onPress: () => { void stopSession(); } },
        ],
      );
      return true;
    });
    return () => sub.remove();
  }, [isStarted, stopSession]);

  const statusText = useMemo(() => {
    if (!isStarted) return `Ready for ${selectedDuration} minutes`;
    if (isRunning) {
      if (selectedSubtask) return `Focusing on ${selectedSubtask.title}`;
      if (selectedTask)    return `Focusing on ${selectedTask.title}`;
      return 'Focusing...';
    }
    if (secondsLeft === 0) return 'Session completed';
    return 'Session paused';
  }, [isRunning, isStarted, secondsLeft, selectedTask, selectedSubtask, selectedDuration]);

  return (
    <>
      <FocusActiveScreen
        visible={isStarted}
        formattedTime={formattedTime}
        statusText={statusText}
        progressPercent={progressPercent}
        isRunning={isRunning}
        onPauseResume={togglePauseResume}
        onStop={() => { void stopSession(); }}
      />
      <PageShell>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
              Deep work mode
            </Text>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
              Focus Mode
            </Text>
          </View>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${colors.focusSession}20`,
            borderWidth: 1,
            borderColor: `${colors.focusSession}40`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="timer" size={20} color={colors.focusSession} />
          </View>
        </View>

        <SectionLabel>SELECT THE TASK</SectionLabel>
        <View style={{ marginBottom: spacing.lg, opacity: isStarted ? 0.5 : 1 }}>
          <TaskAccordionSelector
            tasks={tasksWithSubtasks}
            selectedTaskId={selectedTaskId}
            selectedSubtaskId={selectedSubtaskId}
            onSelectTask={isStarted ? () => {} : setSelectedTaskId}
            onSelectSubtask={isStarted ? () => {} : (id) => setSelectedSubtaskId(id)}
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

        {/* Action buttons */}
        <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
          {/* Primary — Start */}
          <TouchableOpacity
            onPress={() => { void startSession(); }}
            disabled={isRunning || isLoading || isStarted}
            activeOpacity={0.8}
            style={{
              backgroundColor: isRunning || isStarted ? `${colors.focusSession}40` : colors.focusSession,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              shadowColor: colors.focusSession,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isRunning || isStarted ? 0 : 0.4,
              shadowRadius: 12,
              elevation: isRunning || isStarted ? 0 : 6,
              opacity: isRunning || isLoading || isStarted ? 0.55 : 1,
            }}
          >
            <Ionicons name="play-circle" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.4 }}>
              {isLoading ? 'Starting...' : 'Start Focus Session'}
            </Text>
          </TouchableOpacity>

          {/* Secondary — Pause/Resume + Stop */}
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <TouchableOpacity
              onPress={togglePauseResume}
              disabled={!isStarted || secondsLeft === 0}
              activeOpacity={0.75}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 14,
                paddingVertical: 13,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: `${colors.primary}40`,
                opacity: !isStarted || secondsLeft === 0 ? 0.4 : 1,
              }}
            >
              <Ionicons name={isRunning ? 'pause' : 'play'} size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                {isRunning ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { void stopSession(); }}
              disabled={!isStarted}
              activeOpacity={0.75}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 14,
                paddingVertical: 13,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
                borderWidth: 1,
                borderColor: `${colors.error}40`,
                opacity: !isStarted ? 0.4 : 1,
              }}
            >
              <Ionicons name="stop" size={16} color={colors.error} />
              <Text style={{ color: colors.error, fontSize: 14, fontWeight: '600' }}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PageShell>
    </>
  );
}
