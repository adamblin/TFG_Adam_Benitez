import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Card } from '../../../shared/components';
import { useTheme, spacing } from '../../../shared/theme';
import type { ColorPalette } from '../../../shared/theme';
import { CompletedTaskSummary, MonthlyDayCell } from '../hooks/useStatsDashboard';

interface MonthlyCalendarCardProps {
  title: string;
  weeks: MonthlyDayCell[][];
  onPrev: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function makeMetric(colors: ColorPalette) {
  return {
    focus:    { label: 'Focus',    color: colors.secondary, suffix: 'm' },
    tasks:    { label: 'Tasks',    color: colors.success,   suffix: ''  },
    subtasks: { label: 'Subtasks', color: '#F5A623',        suffix: ''  },
  } as const;
}

function makeHeatBg(primary: string, emptySurface: string) {
  return (focus: number, maxFocus: number): string => {
    if (focus === 0) return emptySurface;
    const r = focus / maxFocus;
    if (r < 0.25) return `${primary}35`;
    if (r < 0.50) return `${primary}65`;
    if (r < 0.75) return `${primary}95`;
    return primary;
  };
}

const CIRCLE_H = 22;

// ─── Day detail modal ────────────────────────────────────────────────────────

interface DayModalProps {
  visible: boolean;
  onClose: () => void;
  day: number;
  dow: number;
  monthTitle: string;
  focus: number;
  taskSummaries: CompletedTaskSummary[];
}

function DayModal({ visible, onClose, day, dow, monthTitle, focus, taskSummaries }: DayModalProps) {
  const colors = useTheme();
  const hasContent = focus > 0 || taskSummaries.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={{ flex: 1, backgroundColor: '#000000bb', justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 360 }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <View>
                <Text style={{ color: colors.text, fontSize: 17, fontWeight: '900' }}>
                  {DOW_LABELS[dow]}, {day}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {monthTitle}
                </Text>
              </View>
              <Pressable onPress={onClose} hitSlop={12} style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: colors.background,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: colors.textMuted, fontSize: 16, lineHeight: 20 }}>×</Text>
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView style={{ maxHeight: 360 }} contentContainerStyle={{ padding: spacing.lg }}>
              {!hasContent && (
                <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: spacing.lg }}>
                  No activity recorded
                </Text>
              )}

              {/* Focus time */}
              {focus > 0 && (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
                  backgroundColor: `${colors.secondary}18`,
                  borderRadius: 10, padding: spacing.sm,
                  marginBottom: taskSummaries.length > 0 ? spacing.md : 0,
                  borderLeftWidth: 3, borderLeftColor: colors.secondary,
                }}>
                  <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '700' }}>
                    {focus}m focused
                  </Text>
                </View>
              )}

              {/* Tasks + subtasks */}
              {taskSummaries.map((task, ti) => (
                <View
                  key={ti}
                  style={{
                    marginBottom: ti < taskSummaries.length - 1 ? spacing.md : 0,
                    backgroundColor: `${colors.success}10`,
                    borderRadius: 10,
                    padding: spacing.sm,
                    borderLeftWidth: 3,
                    borderLeftColor: colors.success,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: task.subtasks.length > 0 ? spacing.xs : 0 }}>
                    <Text style={{ color: colors.success, fontSize: 12, fontWeight: '800' }}>✓</Text>
                    <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 }}>{task.title}</Text>
                  </View>
                  {task.subtasks.map((sub, si) => (
                    <View key={si} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: spacing.md, marginTop: 2 }}>
                      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: `${colors.success}88` }} />
                      <Text style={{ color: colors.textMuted, fontSize: 12, flex: 1 }}>{sub}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function MonthlyCalendarCard({ title, weeks, onPrev, onNext, canGoNext }: MonthlyCalendarCardProps) {
  const colors = useTheme();
  const METRIC = makeMetric(colors);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  // On mobile, fit the whole grid within ~55% of the screen height
  const cellHeight = isDesktop ? 110 : 44;
  const circleH = Math.min(CIRCLE_H, Math.round(cellHeight * 0.28));

  const GRID_COLOR = colors.border;
  const CELL_NULL  = colors.background;
  const heatBg = useMemo(
    () => makeHeatBg(colors.primary, colors.surface),
    [colors.primary, colors.surface],
  );

  const allDays  = weeks.flat().filter((d) => d.day !== null);
  const maxFocus = Math.max(...allDays.map((d) => d.focus), 1);

  const todayPos = weeks.reduce<{ cell: MonthlyDayCell; dow: number } | null>((acc, week) => {
    if (acc) return acc;
    const di = week.findIndex((d) => d.isToday);
    return di >= 0 ? { cell: week[di], dow: di } : null;
  }, null);

  const [selected, setSelected] = useState<{ cell: MonthlyDayCell; dow: number } | null>(todayPos);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDayPress = (cell: MonthlyDayCell, dow: number) => {
    setSelected({ cell, dow });
    const hasActivity = cell.focus > 0 || (cell.taskSummaries ?? []).length > 0;
    if (hasActivity) setModalVisible(true);
  };

  return (
    <Card style={{ marginBottom: spacing.md, padding: 0, overflow: 'hidden' }}>

      {/* Header: navigation + legend */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Pressable onPress={onPrev} hitSlop={12} style={{ padding: 4 }}>
            <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '700', lineHeight: 28 }}>‹</Text>
          </Pressable>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', flex: 1, textAlign: 'center' }}>
            {title}
          </Text>
          <Pressable
            onPress={onNext}
            hitSlop={12}
            style={{ padding: 4, opacity: canGoNext ? 1 : 0.25 }}
            disabled={!canGoNext}
          >
            <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '700', lineHeight: 28 }}>›</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.lg }}>
          {Object.values(METRIC).map(({ label, color }) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Day-of-week header */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: GRID_COLOR,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
      }}>
        {DOW_LABELS.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
              {d.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={{ backgroundColor: GRID_COLOR, gap: 1, paddingBottom: 1 }}>
        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row', backgroundColor: GRID_COLOR, gap: 1 }}>
            {week.map((day, di) => {
              if (day.day === null) {
                return <View key={di} style={{ flex: 1, height: cellHeight, backgroundColor: CELL_NULL }} />;
              }

              const isToday     = !!day.isToday;
              const isSelected  = selected?.cell.day === day.day;
              const hasActivity = day.focus > 0 || day.tasks > 0 || day.subtasks > 0;
              const cellBg      = isToday && day.focus === 0 ? `${colors.primary}18` : heatBg(day.focus, maxFocus);

              const activePills = [
                { value: day.focus,    color: METRIC.focus.color,    suffix: 'm' },
                { value: day.tasks,    color: METRIC.tasks.color,    suffix: ''  },
                { value: day.subtasks, color: METRIC.subtasks.color, suffix: ''  },
              ].filter(({ value }) => value > 0);

              return (
                <Pressable
                  key={di}
                  onPress={() => handleDayPress(day, di)}
                  style={{
                    flex: 1,
                    height: cellHeight,
                    backgroundColor: cellBg,
                    borderTopWidth: isToday ? 2.5 : isSelected ? 1.5 : 0,
                    borderTopColor: isToday ? colors.primary : colors.secondary,
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '800',
                    color: isToday ? colors.primary : hasActivity ? colors.text : colors.textMuted,
                  }}>
                    {day.day}
                  </Text>

                  {activePills.length > 0 ? (
                    <View style={{ flexDirection: 'row', gap: 2, alignSelf: 'stretch', paddingHorizontal: 3 }}>
                      {activePills.map(({ value, color, suffix }, idx) => (
                        <View key={idx} style={{
                          flex: 1, height: circleH, borderRadius: circleH / 2,
                          backgroundColor: color,
                          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        }}>
                          <Text style={{
                            color: colors.background,
                            fontSize: value >= 100 ? 7 : 9,
                            fontWeight: '900', lineHeight: circleH,
                          }}>
                            {value}{suffix}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={{ height: circleH }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Day detail modal */}
      {selected && (
        <DayModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          day={selected.cell.day ?? 0}
          dow={selected.dow}
          monthTitle={title}
          focus={selected.cell.focus}
          taskSummaries={selected.cell.taskSummaries ?? []}
        />
      )}
    </Card>
  );
}
