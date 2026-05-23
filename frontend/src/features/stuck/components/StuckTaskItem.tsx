import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, spacing } from '../../../shared/theme';
import type { StuckTask } from '../hooks/useStuckScreen';
import { formatDueDateCa } from '../hooks/useStuckScreen';
import type { ColorPalette } from '../../../shared/theme';
import type { Subtask } from '../../../services/tasks.service';

function getRiskDotColor(risk: StuckTask['risk'], colors: ColorPalette): string {
  if (risk === 'high')   return colors.error;
  if (risk === 'medium') return '#FBBF24';
  return colors.riskLow;
}

type Props = {
  task: StuckTask;
  isLast: boolean;
  showSubtask?: boolean;
  onPress?: () => void;
};

export function StuckTaskItem({ task, isLast, showSubtask = false, onPress }: Props) {
  const colors    = useTheme();
  const dotColor  = getRiskDotColor(task.risk, colors);
  const dueDateCa = formatDueDateCa(task.dueDate);

  // First pending subtask (or first subtask if all done)
  const firstSubtask: Subtask | undefined =
    task.subtasks.find((s) => !s.completed) ?? task.subtasks[0];

  // Subtask dot: green if done, parent risk color if pending
  const subtaskDotColor = firstSubtask?.completed ? colors.riskLow : dotColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* Task row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {/* Risk dot */}
        <View style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: dotColor,
          shadowColor: dotColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 3,
          flexShrink: 0,
        }} />

        <Text
          style={{ flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {dueDateCa !== '' && (
          <Text style={{
            color: task.risk === 'high' ? colors.error : colors.textMuted,
            fontSize: 12,
            fontWeight: task.risk === 'high' ? '700' : '400',
            flexShrink: 0,
          }}>
            {dueDateCa}
          </Text>
        )}
      </View>

      {/* First subtask row — only in "Estic saturat" mode */}
      {showSubtask && firstSubtask && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginTop: 6,
          paddingLeft: 18, // indent under the task dot
        }}>
          {/* Connector line */}
          <View style={{
            position: 'absolute',
            left: 22,
            top: -6,
            width: 1,
            height: 14,
            backgroundColor: `${dotColor}50`,
          }} />

          {/* Subtask dot (smaller) */}
          <View style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: subtaskDotColor,
            shadowColor: subtaskDotColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 3,
            elevation: 2,
            flexShrink: 0,
          }} />

          <Text
            style={{
              flex: 1,
              color: firstSubtask.completed ? colors.textMuted : colors.text,
              fontSize: 12,
              fontWeight: '400',
              textDecorationLine: firstSubtask.completed ? 'line-through' : 'none',
            }}
            numberOfLines={1}
          >
            {firstSubtask.title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
