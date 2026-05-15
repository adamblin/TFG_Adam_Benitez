import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

type Props = { days: number };

export function StreakHeaderCard({ days }: Props) {
  return (
    <Card style={{ padding: spacing.lg, marginBottom: spacing.lg, borderRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: colors.primary, fontSize: 34, fontWeight: '900' }}>{days}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>days streak</Text>
        </View>

        <View style={{ backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 }}>
          <Text style={{ color: colors.background, fontWeight: '700' }}>Complete 1 subtask today to keep it</Text>
        </View>
      </View>
    </Card>
  );
}
