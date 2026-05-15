import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { TodayStats } from '../hooks/useStatsDashboard';

function MetricColumn({
  label, value, suffix, color,
}: {
  label: string; value: number; suffix: string; color: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1 }}>
          {value}
        </Text>
        {suffix ? (
          <Text style={{ color: colors.textMuted, fontSize: 15, fontWeight: '700' }}>{suffix}</Text>
        ) : null}
      </View>

      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

interface TodayBannerProps {
  today: TodayStats;
}

export function TodayBanner({ today }: TodayBannerProps) {
  return (
    <Card style={{ marginBottom: spacing.md }}>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 999,
            paddingHorizontal: spacing.sm,
            paddingVertical: 3,
          }}>
            <Text style={{ color: colors.background, fontSize: 10, fontWeight: '900', letterSpacing: 1 }}>
              TODAY
            </Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{today.label}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <MetricColumn label="Focus Time" value={today.focus} suffix="m" color={colors.primary} />

        <View style={{ width: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} />

        <MetricColumn label="Tasks Done" value={today.tasks} suffix="" color={colors.success} />

        <View style={{ width: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} />

        <MetricColumn label="Subtasks" value={today.subtasks} suffix="" color="#F5A623" />
      </View>

    </Card>
  );
}
