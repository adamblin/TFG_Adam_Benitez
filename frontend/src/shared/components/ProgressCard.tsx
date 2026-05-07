import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface ProgressCardProps {
  percent: number;
  completed: number;
  total: number;
  label?: string;
}

export function ProgressCard({
  percent,
  completed,
  total,
  label = 'TODAY PROGRESS',
}: ProgressCardProps) {
  return (
    <Card style={{ marginBottom: spacing.lg }}>
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.sm }}>
        <Text style={{ color: colors.text, fontSize: 42, fontWeight: '900' }}>{percent}%</Text>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900' }}>
            {completed}/{total}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>subtasks</Text>
        </View>
      </View>
      <ProgressBar percent={percent} />
    </Card>
  );
}
