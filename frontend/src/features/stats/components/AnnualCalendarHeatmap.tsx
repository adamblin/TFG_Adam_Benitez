import React, { useMemo } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { AnnualHeatmapData } from '../hooks/useStatsDashboard';

const H_PAD = spacing.lg;          // padding left & right inside the card section
const DOW_COL_W = 32;              // fixed width of the day-label column
const DOW_COL_GAP = 6;             // gap between day-label column and the grid
const CELL_GAP = 2;                // gap between cells (rows and columns)
const MONTH_CELL_GAP = 4;          // extra gap between month-label row and first cell row

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function heatColor(focus: number, maxFocus: number): string {
  if (focus === 0) return '#161f30';
  const r = focus / maxFocus;
  if (r < 0.25) return '#1c1040';
  if (r < 0.50) return '#261558';
  if (r < 0.75) return '#301b70';
  return '#4a2090';
}

interface Props {
  data: AnnualHeatmapData;
  activeDays: number;
}

export function AnnualCalendarHeatmap({ data, activeDays }: Props) {
  const { weeks, monthPositions, maxFocus } = data;
  const { width } = useWindowDimensions();

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const numWeeks = weeks.length;

  // Grid container width: window minus PageShell padding, minus H_PAD on both sides,
  // minus the DOW column, minus the same DOW column width mirrored on the right
  // so that both sides of the cell grid are visually symmetric.
  const gridWidth =
    width
    - spacing.lg * 2       // PageShell horizontal padding
    - H_PAD * 2            // inner section horizontal padding
    - DOW_COL_W            // day-label column
    - DOW_COL_GAP          // gap after day-label column
    - DOW_COL_W            // mirror right margin = same as left DOW section
    - DOW_COL_GAP;

  // Exact (float) cell size — cells use flex:1 so no rounding gap appears
  const CELL = (gridWidth - (numWeeks - 1) * CELL_GAP) / numWeeks;

  const MONTH_H = Math.max(10, CELL - 2);
  const RADIUS = Math.max(1, Math.round(CELL / 5));
  const FONT = Math.max(7, Math.min(11, CELL - 3));

  return (
    <Card style={{ marginBottom: spacing.md, padding: 0, overflow: 'hidden' }}>

      {/* ── Header ── */}
      <View style={{
        paddingHorizontal: H_PAD,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff0c',
      }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '900' }}>
            Year at a Glance
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 3 }}>
            {new Date().getFullYear()} · focus minutes per day
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: colors.primary, fontSize: 26, fontWeight: '900', lineHeight: 28 }}>
            {activeDays}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>active days</Text>
        </View>
      </View>

      {/* ── Heatmap body ── */}
      <View style={{ paddingHorizontal: H_PAD, paddingTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

          {/* Day-of-week labels — fixed left column */}
          <View style={{
            width: DOW_COL_W,
            marginRight: DOW_COL_GAP,
            paddingTop: MONTH_H + MONTH_CELL_GAP,
            gap: CELL_GAP,
          }}>
            {DOW_LABELS.map((label, di) => (
              <View key={di} style={{ height: CELL, justifyContent: 'center' }}>
                <Text style={{ color: colors.textMuted, fontSize: FONT, fontWeight: '600' }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Cell grid — fills gridWidth exactly */}
          <View style={{ width: gridWidth }}>

            {/* Month labels row */}
            <View style={{
              flexDirection: 'row',
              gap: CELL_GAP,
              height: MONTH_H,
              marginBottom: MONTH_CELL_GAP,
            }}>
              {weeks.map((_, wi) => {
                const mp = monthPositions.find((m) => m.weekIndex === wi);
                return (
                  <View key={wi} style={{ flex: 1 }}>
                    {mp && (
                      <Text style={{
                        color: colors.textMuted,
                        fontSize: FONT,
                        fontWeight: '700',
                      }}>
                        {mp.label}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* 7 rows Mon → Sun */}
            <View style={{ gap: CELL_GAP }}>
              {Array.from({ length: 7 }, (_, di) => (
                <View key={di} style={{ flexDirection: 'row', gap: CELL_GAP }}>
                  {weeks.map((week, wi) => {
                    const day = week[di];
                    const isToday = day.date?.toDateString() === todayStr;
                    return (
                      <View
                        key={wi}
                        style={{
                          flex: 1,
                          height: CELL,
                          borderRadius: RADIUS,
                          backgroundColor: day.date
                            ? heatColor(day.focus, maxFocus)
                            : 'transparent',
                          borderWidth: isToday ? 1.5 : 0,
                          borderColor: colors.primary,
                        }}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* Mirror right spacer — same visual weight as the DOW column on the left */}
          <View style={{ width: DOW_COL_W + DOW_COL_GAP }} />

        </View>
      </View>

      {/* ── Legend ── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: CELL_GAP + 1,
        paddingHorizontal: H_PAD,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        marginTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#ffffff0c',
      }}>
        <Text style={{ color: colors.textMuted, fontSize: 9, marginRight: 1 }}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <View
            key={i}
            style={{
              width: Math.min(Math.round(CELL), 13),
              height: Math.min(Math.round(CELL), 13),
              borderRadius: RADIUS,
              backgroundColor: r === 0 ? '#161f30' : heatColor(r * maxFocus, maxFocus),
            }}
          />
        ))}
        <Text style={{ color: colors.textMuted, fontSize: 9, marginLeft: 1 }}>More</Text>
      </View>

    </Card>
  );
}
