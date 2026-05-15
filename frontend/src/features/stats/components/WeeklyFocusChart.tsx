import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { WeeklyChartData } from '../hooks/useStatsDashboard';

const BAR_AREA_H = 130;
const LABEL_H    = 22;
const BADGE_H    = 20;
const CHART_H    = BAR_AREA_H + LABEL_H + BADGE_H;

function fmtMin(m: number): string {
  if (m === 0) return '0m';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

function Delta({ thisVal, lastVal }: { thisVal: number; lastVal: number }) {
  if (lastVal === 0) return null;
  const pct = Math.round(((thisVal - lastVal) / lastVal) * 100);
  const up = pct >= 0;
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: up ? '#0d2e1a' : '#2e0d0d',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 99,
      marginLeft: 6,
    }}>
      <Text style={{ color: up ? colors.success : colors.error, fontSize: 12, fontWeight: '800' }}>
        {up ? '↑' : '↓'} {Math.abs(pct)}%
      </Text>
    </View>
  );
}

interface Props {
  data: WeeklyChartData;
}

export function WeeklyFocusChart({ data }: Props) {
  const { labels, focusThis, focusLast, tasks, subtasks, todayIdx, totalFocusThis, totalFocusLast } = data;

  const maxVal = Math.max(...focusThis, ...focusLast, 1);

  const barH = (val: number) =>
    val > 0 ? Math.max(6, (val / maxVal) * BAR_AREA_H) : 0;

  return (
    <Card style={{ marginBottom: spacing.md }}>

      {/* ── Header ── */}
      <View style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>Focus This Week</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '900' }}>
              {fmtMin(totalFocusThis)}
            </Text>
            <Delta thisVal={totalFocusThis} lastVal={totalFocusLast} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary }} />
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>This week</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#2a3d5c' }} />
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Last week</Text>
          </View>
        </View>
      </View>

      {/* ── Chart ── */}
      <View style={{ height: CHART_H, flexDirection: 'row' }}>
        {labels.map((label, i) => {
          const isToday   = i === todayIdx;
          const isPast    = i <= todayIdx;
          const thisH     = barH(focusThis[i]);
          const lastH     = barH(focusLast[i]);
          const taskCount = tasks[i];
          const subCount  = subtasks[i];
          const hasActivity = focusThis[i] > 0 || taskCount > 0;

          return (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: isToday ? '#ffffff07' : 'transparent',
                borderRadius: 8,
              }}
            >
              {/* Task / subtask badges above bars */}
              <View style={{ height: BADGE_H, justifyContent: 'flex-end', paddingBottom: 3 }}>
                {taskCount > 0 && (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <View style={{
                      backgroundColor: colors.success,
                      borderRadius: 99,
                      minWidth: 16,
                      height: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 3,
                    }}>
                      <Text style={{ color: '#000', fontSize: 8, fontWeight: '900' }}>
                        {taskCount}
                      </Text>
                    </View>
                    {subCount > 0 && (
                      <View style={{
                        backgroundColor: '#F5A623',
                        borderRadius: 99,
                        minWidth: 14,
                        height: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 2,
                      }}>
                        <Text style={{ color: '#000', fontSize: 7, fontWeight: '900' }}>
                          {subCount}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Bar area */}
              <View style={{
                height: BAR_AREA_H,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'relative',
              }}>
                {/* Ghost bar — last week */}
                {lastH > 0 && (
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '58%',
                    height: lastH,
                    backgroundColor: '#2a3d5c',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }} />
                )}
                {/* Current bar — this week */}
                {thisH > 0 && (
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '42%',
                    height: thisH,
                    backgroundColor: isPast ? colors.primary : `${colors.primary}40`,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }} />
                )}
                {/* No-activity stub */}
                {thisH === 0 && lastH === 0 && (
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '42%',
                    height: 3,
                    backgroundColor: '#1e2d45',
                    borderRadius: 2,
                  }} />
                )}
                {/* Today indicator line */}
                {isToday && (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    width: 2,
                    height: BAR_AREA_H,
                    backgroundColor: `${colors.primary}22`,
                  }} />
                )}
              </View>

              {/* Day label */}
              <View style={{ height: LABEL_H, justifyContent: 'center' }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: isToday ? '900' : '600',
                  color: isToday ? colors.primary : hasActivity ? colors.text : colors.textMuted,
                }}>
                  {label.slice(0, 2)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Value labels on hover row — show min only on active days ── */}
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {focusThis.map((val, i) => (
          <Text
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              color: i === todayIdx ? colors.primary : colors.textMuted,
              fontSize: 9,
              fontWeight: '700',
            }}
          >
            {val > 0 ? fmtMin(val) : ''}
          </Text>
        ))}
      </View>

    </Card>
  );
}
