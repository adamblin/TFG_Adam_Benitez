import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

type Props = { title: string; subtitle?: string; unlocked?: boolean };

export function AchievementCard({ title, subtitle, unlocked = false }: Props) {
  return (
    <Card
      style={{
        padding: spacing.md,
        borderRadius: 12,
        backgroundColor: unlocked ? colors.surface : colors.background,
        opacity: unlocked ? 1 : 0.55,
      }}
    >
      <View style={{ minHeight: 88, justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, marginBottom: spacing.xs }}>{unlocked ? '★' : '○'}</Text>
        <Text style={{ color: unlocked ? colors.primary : colors.textMuted, fontWeight: '900', fontSize: 16 }}>
          {title}
        </Text>
        <Text style={{ color: unlocked ? colors.text : colors.textMuted, marginTop: spacing.xs, fontSize: 12 }}>
          {subtitle}
        </Text>
        {unlocked && (
          <View style={{
            marginTop: spacing.sm,
            alignSelf: 'flex-start',
            backgroundColor: colors.success,
            borderRadius: 999,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
          }}>
            <Text style={{ color: colors.background, fontSize: 10, fontWeight: '800' }}>UNLOCKED</Text>
          </View>
        )}
      </View>
    </Card>
  );
}
