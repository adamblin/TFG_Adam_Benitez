import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { MomentumData } from '../hooks/useStatsDashboard';

function fmtMin(m: number): string {
  if (m === 0) return '0m';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return <Text style={{ color: colors.textMuted, fontSize: 12 }}>No prev data</Text>;
  }
  const positive = delta >= 0;
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: positive ? '#0d2e1a' : '#2e0d0d',
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 99,
    }}>
      <Text style={{ color: positive ? colors.success : colors.error, fontSize: 13, fontWeight: '900' }}>
        {positive ? '↑' : '↓'} {Math.abs(delta)}%
      </Text>
    </View>
  );
}

interface MomentumCardProps {
  data: MomentumData;
}

export function MomentumCard({ data }: MomentumCardProps) {
  const { thisMonthFocus, lastMonthFocus, focusDelta, thisMonthTasks, lastMonthTasks, tasksDelta } = data;

  const rows = [
    {
      label: 'Focus Time',
      thisVal: fmtMin(thisMonthFocus),
      lastVal: fmtMin(lastMonthFocus),
      delta: focusDelta,
      color: colors.primary,
    },
    {
      label: 'Tasks Done',
      thisVal: String(thisMonthTasks),
      lastVal: String(lastMonthTasks),
      delta: tasksDelta,
      color: colors.success,
    },
  ];

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>Monthly Momentum</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
          This month vs last month
        </Text>
      </View>

      <View style={{ gap: spacing.lg }}>
        {rows.map(({ label, thisVal, lastVal, delta, color }) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 3 }}>{label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ color, fontSize: 24, fontWeight: '900' }}>{thisVal}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>vs {lastVal}</Text>
              </View>
            </View>
            <DeltaBadge delta={delta} />
          </View>
        ))}
      </View>
    </Card>
  );
}
