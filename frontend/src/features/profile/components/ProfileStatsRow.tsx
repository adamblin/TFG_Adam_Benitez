import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../shared/components';
import type { ProfileStat } from '../hooks/useProfileScreen';
import { useTheme, spacing } from '../../../shared/theme';

type ProfileStatsRowProps = {
  stats: ProfileStat[];
};

const STAT_META: { icon: keyof typeof Ionicons.glyphMap; colorKey: 'task' | 'focusSession' | 'subtask' }[] = [
  { icon: 'checkmark-circle', colorKey: 'task' },
  { icon: 'timer',            colorKey: 'focusSession' },
  { icon: 'flash',            colorKey: 'subtask' },
];

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  const colors = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
      {stats.map((stat, i) => {
        const meta = STAT_META[i] ?? STAT_META[0];
        const accentColor = colors[meta.colorKey];
        return (
          <Card key={stat.label} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.md }}>
            <View style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: `${accentColor}20`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xs,
              borderWidth: 1,
              borderColor: `${accentColor}40`,
            }}>
              <Ionicons name={meta.icon} size={20} color={accentColor} />
            </View>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900', lineHeight: 28 }}>
              {stat.value}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
              {stat.label}
            </Text>
          </Card>
        );
      })}
    </View>
  );
}
