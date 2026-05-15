import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { BestDayData } from '../hooks/useStatsDashboard';

function fmtMin(minutes: number): string {
  if (minutes === 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

interface BestDayCardProps {
  data: BestDayData;
}

export function BestDayCard({ data }: BestDayCardProps) {
  const { labels, data: values, bestIdx } = data;
  const max = Math.max(...values, 1);
  const hasAnyData = values.some((v) => v > 0);

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>Peak Day</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            Focus by day of week this year
          </Text>
        </View>
        {hasAnyData && (
          <View style={{
            backgroundColor: `${colors.primary}20`,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 99,
          }}>
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '800' }}>
              {labels[bestIdx]}
            </Text>
          </View>
        )}
      </View>

      <View style={{ gap: 10 }}>
        {labels.map((label, i) => {
          const isBest = hasAnyData && i === bestIdx;
          const pct = values[i] > 0 ? Math.max(3, (values[i] / max) * 100) : 0;
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{
                width: 30,
                color: isBest ? colors.text : colors.textMuted,
                fontSize: 12,
                fontWeight: isBest ? '800' : '500',
              }}>
                {label}
              </Text>
              <View style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: '#151e30', overflow: 'hidden' }}>
                <View style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: isBest ? colors.primary : '#2a3a58',
                }} />
              </View>
              <Text style={{
                width: 40,
                textAlign: 'right',
                color: isBest ? colors.primary : colors.textMuted,
                fontSize: 11,
                fontWeight: isBest ? '800' : '500',
              }}>
                {fmtMin(values[i])}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
