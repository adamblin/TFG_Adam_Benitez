import React, { useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme';
import { Card } from './Card';

interface TaskCardItem {
  id: string;
  title: string;
  done: boolean;
  createdAt?: string;
}

interface TaskCardProps {
  task: TaskCardItem;
  onToggle: (task: TaskCardItem) => void;
  isUpdating?: boolean;
}

export function TaskCard({ task, onToggle, isUpdating = false }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: spacing.sm }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing.md,
        }}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={{ flex: 1, paddingRight: spacing.sm }}>
          <Text
            style={[
              {
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
                lineHeight: 24,
              },
              task.done && {
                textDecorationLine: 'line-through',
                color: colors.textMuted,
              },
            ]}
          >
            {task.title}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => onToggle(task)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '900' }}>
              {task.done ? '✓' : '◯'}
            </Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            backgroundColor: '#0d162a',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 999,
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: colors.background, fontSize: 11, fontWeight: '700' }}>
                {task.done ? 'Done' : 'Active'}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>Created today</Text>
          </View>
          <View
            style={{
              height: 8,
              borderRadius: 999,
              backgroundColor: colors.border,
              marginBottom: spacing.md,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: '40%',
                height: '100%',
                backgroundColor: colors.primary,
                borderRadius: 999,
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingVertical: spacing.sm,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>Show subtasks</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}
