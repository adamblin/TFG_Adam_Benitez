import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { MonthlyDailyPoint } from '../hooks/useStatsDashboard';

const SCALE = [
  '#0d1320',  // 0 — no focus
  '#1c1040',  // 1 — very low
  '#261558',  // 2
  '#301b70',  // 3
  '#3c228c',  // 4
  '#4a2aaa',  // 5 — high
] as const;

function cellColor(focus: number, max: number): string {
  if (focus === 0) return SCALE[0];
  const pct = focus / max;
  if (pct <= 0.15) return SCALE[1];
  if (pct <= 0.35) return SCALE[2];
  if (pct <= 0.55) return SCALE[3];
  if (pct <= 0.75) return SCALE[4];
  return SCALE[5];
}

function fmtMin(m: number): string {
  if (m === 0) return '0m';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

interface Props {
  data: MonthlyDailyPoint[];
}

export function MonthlyLineChart({ data }: Props) {
  const { width } = useWindowDimensions();

  const cardPad  = spacing.md * 2;
  const pagePad  = spacing.lg * 2;
  const innerW   = width - pagePad - cardPad;

  const n        = data.length;
  const maxFocus = Math.max(...data.map((d) => d.focus), 1);
  const total    = data.reduce((s, d) => s + d.focus, 0);

  // Split into two rows
  const ROW_COUNT  = 2;
  const perRow     = Math.ceil(n / ROW_COUNT);
  const rows       = [data.slice(0, perRow), data.slice(perRow)];

  const GAP       = 3;
  const CELL_SIZE = Math.floor((innerW - GAP * (perRow - 1)) / perRow);
  const LABEL_H   = 14;

  return (
    <Card style={{ marginBottom: spacing.md }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
      }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>
            Daily Focus
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            Intensity per day this month
          </Text>
        </View>
        <Text style={{ color: colors.secondary, fontSize: 22, fontWeight: '900' }}>
          {fmtMin(total)}
        </Text>
      </View>

      {/* Heatmap rows */}
      <View style={{ gap: GAP + LABEL_H + 2 }}>
        {rows.map((row, ri) => (
          <View key={ri}>
            {/* Cells */}
            <View style={{ flexDirection: 'row', gap: GAP }}>
              {row.map((d) => {
                const bg      = cellColor(d.focus, maxFocus);
                const isToday = d.isToday;
                const hasTask = d.tasks > 0;
                return (
                  <View
                    key={d.day}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      borderRadius: 4,
                      backgroundColor: bg,
                      borderWidth: isToday ? 1.5 : 0,
                      borderColor: isToday ? colors.primary : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Task dot */}
                    {hasTask && (
                      <View style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.success,
                      }} />
                    )}
                  </View>
                );
              })}
            </View>
            {/* Day number labels */}
            <View style={{ flexDirection: 'row', gap: GAP, marginTop: 3 }}>
              {row.map((d) => (
                <View key={d.day} style={{ width: CELL_SIZE, alignItems: 'center' }}>
                  <Text style={{
                    color: d.isToday ? colors.primary : colors.textMuted,
                    fontSize: 9,
                    fontWeight: d.isToday ? '900' : '400',
                  }}>
                    {d.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md }}>
        <Text style={{ color: colors.textMuted, fontSize: 10 }}>Less</Text>
        {SCALE.slice(1).map((c) => (
          <View key={c} style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: c }} />
        ))}
        <Text style={{ color: colors.textMuted, fontSize: 10 }}>More</Text>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>Task done</Text>
        </View>
      </View>
    </Card>
  );
}
