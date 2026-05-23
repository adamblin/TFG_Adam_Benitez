import React, { useMemo } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Card } from '../../../shared/components';
import { useTheme, spacing } from '../../../shared/theme';
import type { AnnualHeatmapData } from '../hooks/useStatsDashboard';

const H_PAD       = spacing.lg;
const DOW_COL_W   = 28;
const DOW_COL_GAP = 6;
const CELL_GAP    = 3;
const MONTH_H     = 14;
const MONTH_GAP   = 4;
const DESKTOP_BP  = 768;

// Fixed cell size: big enough to be tappable, small enough to be dense
const CELL_MOBILE  = 10;
const CELL_DESKTOP = 13;

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function makeHeatColor(primary: string, emptyColor: string) {
  return (focus: number, maxFocus: number): string => {
    if (focus === 0) return emptyColor;
    const r = focus / maxFocus;
    if (r < 0.25) return `${primary}38`;
    if (r < 0.50) return `${primary}68`;
    if (r < 0.75) return `${primary}98`;
    return primary;
  };
}

interface Props {
  data: AnnualHeatmapData;
  activeDays: number;
}

export function AnnualCalendarHeatmap({ data, activeDays }: Props) {
  const colors = useTheme();
  const { weeks, monthPositions, maxFocus } = data;
  const { width } = useWindowDimensions();

  const isDesktop = width >= DESKTOP_BP;
  const todayStr  = useMemo(() => new Date().toDateString(), []);
  const heatColor = useMemo(
    () => makeHeatColor(colors.primary, colors.border),
    [colors.primary, colors.border],
  );

  const numWeeks = weeks.length;

  // On desktop: stretch to fill available width (same as before, minus sidebar ~220px)
  // On mobile: use a fixed cell size and let the grid scroll horizontally
  const CELL = useMemo(() => {
    if (isDesktop) {
      const availW =
        width - 220              // sidebar
        - spacing.lg * 2        // PageShell padding
        - H_PAD * 2
        - DOW_COL_W - DOW_COL_GAP * 2;
      return Math.max(CELL_DESKTOP, (availW - (numWeeks - 1) * CELL_GAP) / numWeeks);
    }
    return CELL_MOBILE;
  }, [isDesktop, width, numWeeks]);

  const RADIUS = Math.max(2, Math.round(CELL / 4));
  const FONT   = Math.max(7, Math.min(11, CELL - 1));

  // Total pixel width of the scrollable grid
  const gridPx = numWeeks * CELL + (numWeeks - 1) * CELL_GAP;

  const Grid = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

      {/* Day-of-week labels */}
      <View style={{
        width: DOW_COL_W,
        marginRight: DOW_COL_GAP,
        paddingTop: MONTH_H + MONTH_GAP,
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

      {/* Cell grid */}
      <View style={{ width: gridPx }}>

        {/* Month labels */}
        <View style={{ flexDirection: 'row', gap: CELL_GAP, height: MONTH_H, marginBottom: MONTH_GAP }}>
          {weeks.map((_, wi) => {
            const mp = monthPositions.find((m) => m.weekIndex === wi);
            return (
              <View key={wi} style={{ width: CELL }}>
                {mp && (
                  <Text style={{ color: colors.textMuted, fontSize: FONT, fontWeight: '700' }}>
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
                const day     = week[di];
                const isToday = day.date?.toDateString() === todayStr;
                return (
                  <View
                    key={wi}
                    style={{
                      width: CELL,
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
    </View>
  );

  return (
    <Card style={{ marginBottom: spacing.md, padding: 0, overflow: 'hidden' }}>

      {/* Header */}
      <View style={{
        paddingHorizontal: H_PAD,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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

      {/* Heatmap — horizontal scroll on mobile, static on desktop */}
      {isDesktop ? (
        <View style={{ paddingHorizontal: H_PAD, paddingTop: spacing.md }}>
          {Grid}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: H_PAD, paddingTop: spacing.md, paddingRight: H_PAD + 8 }}
        >
          {Grid}
        </ScrollView>
      )}

      {/* Legend */}
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
        borderTopColor: colors.border,
      }}>
        <Text style={{ color: colors.textMuted, fontSize: 9, marginRight: 1 }}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <View
            key={i}
            style={{
              width: Math.min(Math.round(CELL), 13),
              height: Math.min(Math.round(CELL), 13),
              borderRadius: RADIUS,
              backgroundColor: heatColor(r * maxFocus, maxFocus),
            }}
          />
        ))}
        <Text style={{ color: colors.textMuted, fontSize: 9, marginLeft: 1 }}>More</Text>
      </View>

    </Card>
  );
}
