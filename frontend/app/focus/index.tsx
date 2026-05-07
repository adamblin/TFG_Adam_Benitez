import React, { useState } from 'react';
import { Alert } from 'react-native';
import { colors, spacing } from '../../src/shared/theme';
import {
  PageShell,
  Button,
  Card,
  SectionLabel,
  TaskSelector,
  DurationSelector,
} from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';

export default function FocusScreen() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  const { data: tasks = [] } = useTasks();

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const durations = [5, 10, 25, 45];

  const handleStartSession = () => {
    if (!selectedTask) {
      Alert.alert('Error', 'Please select a task to focus on');
      return;
    }
    Alert.alert(
      'Focus Session',
      `Starting ${selectedDuration} minute focus session on:\n\n${selectedTask.title}`
    );
  };

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
      <Card style={{ minHeight: 60, justifyContent: 'center', marginBottom: spacing.lg }}>
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>Select subtasks...</Text>
      </Card>

      <SectionLabel>ANOTHER TASK</SectionLabel>
      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.xs }}>
          Review focus flow
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>
          Understand the full flow and optimize
        </Text>
      </Card>

      <SectionLabel>DURATION</SectionLabel>
      <DurationSelector
        durations={durations}
        selectedDuration={selectedDuration}
        onSelect={setSelectedDuration}
      />

      <Button
        label="▶ Start focus session"
        variant="outline"
        onPress={handleStartSession}
        style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}
      />
    </PageShell>
  );
}

import { Text } from 'react-native';
