import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, spacing } from '../../../shared/theme';
import type { StuckTask } from '../hooks/useStuckScreen';
import { formatDueDateCa } from '../hooks/useStuckScreen';
import type { ColorPalette } from '../../../shared/theme';
import type { Subtask } from '../../../services/tasks.service';

function getRiskColor(risk: StuckTask['risk'], colors: ColorPalette): string {
  if (risk === 'high')   return colors.error;
  if (risk === 'medium') return '#FBBF24';
  return colors.riskLow;
}

function getSubtaskProgress(subtasks: Subtask[]): number {
  if (subtasks.length === 0) return 0;
  return Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100);
}

type Props = {
  task: StuckTask;
  rank: number;           // 1, 2, 3
  isExpanded: boolean;
  onPress: () => void;    // toggle expand/collapse
  onFocusPress: () => void;
};

export function StuckTaskCard({ task, rank, isExpanded, onPress, onFocusPress }: Props) {
  const colors     = useTheme();
  const riskColor  = getRiskColor(task.risk, colors);
  const dueDateCa  = formatDueDateCa(task.dueDate);
  const progress   = getSubtaskProgress(task.subtasks);
  const firstSubtask: Subtask | undefined =
    task.subtasks.find((s) => !s.completed) ?? task.subtasks[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isExpanded ? 1 : 0.72}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${riskColor}40`,
        borderTopColor: `${riskColor}80`,
        backgroundColor: colors.surface,
        overflow: 'hidden',
        marginBottom: spacing.sm,
      }}
    >
      {/* Risk-colored top sheen */}
      <LinearGradient
        colors={[`${riskColor}12`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60 }}
        pointerEvents="none"
      />

      <View style={{ padding: spacing.md }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 10 }}>
          {/* Rank badge */}
          <View style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: `${riskColor}22`,
            borderWidth: 1.5,
            borderColor: `${riskColor}55`,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Text style={{ color: riskColor, fontSize: 17, fontWeight: '900' }}>{rank}</Text>
          </View>

          {/* Title + meta */}
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 3 }}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {/* Semaphore dot */}
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: riskColor,
                shadowColor: riskColor,
                shadowOpacity: 0.8,
                shadowRadius: 3,
                elevation: 2,
              }} />
              {dueDateCa !== '' && (
                <Text style={{ color: riskColor, fontSize: 12, fontWeight: '700' }}>{dueDateCa}</Text>
              )}
              {task.subtasks.length > 0 && (
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>{progress}%</Text>
              )}
            </View>
          </View>

          {/* Chevron */}
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={colors.textMuted}
          />
        </View>

        {/* Progress bar */}
        {task.subtasks.length > 0 && (
          <View style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: `${riskColor}22`,
            overflow: 'hidden',
            marginBottom: isExpanded ? spacing.md : 0,
          }}>
            <View style={{
              width: `${Math.max(2, progress)}%`,
              height: '100%',
              borderRadius: 2,
              backgroundColor: riskColor,
            }} />
          </View>
        )}

        {/* Expanded section — first subtask suggestion + focus button */}
        {isExpanded && firstSubtask && (
          <>
            <Text style={{
              color: colors.textMuted,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.6,
              marginBottom: spacing.xs,
            }}>
              Suggested first step
            </Text>

            <View style={{
              backgroundColor: `${colors.primary}10`,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: `${colors.primary}25`,
              paddingVertical: 10,
              paddingHorizontal: spacing.sm,
              marginBottom: spacing.sm,
            }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>
                {firstSubtask.title}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onFocusPress}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                backgroundColor: colors.focusSession,
                borderRadius: 12,
                paddingVertical: 11,
                shadowColor: colors.focusSession,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons name="play" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>
                Start focus on this task
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
