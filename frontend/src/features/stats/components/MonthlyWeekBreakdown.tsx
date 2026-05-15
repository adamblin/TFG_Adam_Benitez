import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { WeekBreakdownItem } from '../hooks/useStatsDashboard';

function fmtMin(m: number): string {
  if (m === 0) return '—';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

interface Props {
  weeks: WeekBreakdownItem[];
}

export function MonthlyWeekBreakdown({ weeks }: Props) {
  const maxFocus = Math.max(...weeks.map((w) => w.focus), 1);
  const bestIdx  = weeks.reduce((bi, w, i) => (w.focus > weeks[bi].focus ? i : bi), 0);
  const hasAny   = weeks.some((w) => w.focus > 0);

  return (
    <Card style={{ marginBottom: spacing.md }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>Weekly Breakdown</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>Focus time per week this month</Text>
        </View>
        {hasAny && (
          <View style={{
            backgroundColor: '#FFD70020',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 99,
            borderWidth: 1,
            borderColor: '#FFD70040',
          }}>
            <Text style={{ color: '#FFD700', fontSize: 12, fontWeight: '800' }}>
              🏆 {weeks[bestIdx]?.label}
            </Text>
          </View>
        )}
      </View>

      {/* Week rows */}
      <View style={{ gap: 14 }}>
        {weeks.map((week, i) => {
          const isCurrent = week.isCurrentWeek;
          const isBest    = hasAny && i === bestIdx && !isCurrent;
          const barPct    = week.focus > 0
            ? Math.max(4, (week.focus / maxFocus) * 100)
            : 0;

          const barColor = isCurrent
            ? colors.primary
            : isBest
              ? '#FFD700'
              : '#2a3d5c';

          const labelColor = isCurrent
            ? colors.primary
            : isBest
              ? '#FFD700'
              : colors.textMuted;

          return (
            <View key={i}>
              {/* Row header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: labelColor, fontSize: 13, fontWeight: '800', width: 24 }}>
                    {week.label}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    {week.dateRange}
                  </Text>
                  {isCurrent && (
                    <View style={{
                      backgroundColor: `${colors.primary}20`,
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 99,
                    }}>
                      <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>now</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {week.tasks > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{week.tasks}</Text>
                    </View>
                  )}
                  <Text style={{
                    color: week.focus > 0 ? labelColor : colors.textMuted,
                    fontSize: 13,
                    fontWeight: '800',
                    minWidth: 40,
                    textAlign: 'right',
                  }}>
                    {fmtMin(week.focus)}
                  </Text>
                </View>
              </View>

              {/* Bar */}
              <View style={{ height: 8, backgroundColor: '#111827', borderRadius: 4, overflow: 'hidden' }}>
                {barPct > 0 && (
                  <View style={{
                    width: `${barPct}%`,
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: barColor,
                  }} />
                )}
              </View>
            </View>
          );
        })}
      </View>

    </Card>
  );
}
