import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import type { WeeklyChartData } from '../hooks/useStatsDashboard';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COL_GAP  = 6;
const NUM_COLS = 7;
const CHART_H  = 100;

function fmtMin(m: number): string {
  if (m === 0) return '0m';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h}h` : `${h}h${r < 10 ? '0' : ''}${r}m`;
}

function useColW() {
  const { width } = useWindowDimensions();
  const pagePad = spacing.lg * 2;  // PageShell padding
  const cardPad = spacing.md * 2;  // Card padding
  return (width - pagePad - cardPad - COL_GAP * (NUM_COLS - 1)) / NUM_COLS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

function HeroBadge({ up, delta }: { up: boolean; delta: number }) {
  return (
    <View style={{
      backgroundColor: up ? '#0a2318' : '#2a0a0a',
      paddingHorizontal: 10, paddingVertical: 6,
      borderRadius: 12,
      alignItems: 'center',
    }}>
      <Text style={{ color: up ? colors.success : colors.error, fontSize: 15, fontWeight: '900' }}>
        {up ? '↑' : '↓'}{Math.abs(delta)}%
      </Text>
      <Text style={{ color: up ? `${colors.success}80` : `${colors.error}80`, fontSize: 9, marginTop: 1 }}>
        vs last week
      </Text>
    </View>
  );
}

function InsightBar({ color, text }: { color: string; text: string }) {
  return (
    <View style={{
      marginTop: spacing.sm,
      backgroundColor: `${color}12`,
      borderRadius: 10,
      padding: spacing.sm,
      borderLeftWidth: 2,
      borderLeftColor: color,
    }}>
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart 1 · Focus Time  (purple / secondary)
// ─────────────────────────────────────────────────────────────────────────────
function FocusCard({ data }: { data: WeeklyChartData }) {
  const { focusThis, focusLast, todayIdx, totalFocusThis, totalFocusLast } = data;
  const colW  = useColW();
  const ACCENT = colors.secondary;

  const maxVal      = Math.max(...focusThis, ...focusLast, 1);
  const bestIdx     = focusThis.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const nonZeroDays = focusThis.filter((v) => v > 0).length;

  const delta = totalFocusLast > 0
    ? Math.round(((totalFocusThis - totalFocusLast) / totalFocusLast) * 100)
    : null;

  return (
    <Card style={{ marginBottom: spacing.md }}>
      {/* Hero */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.xl }}>
        <View>
          <Text style={{ color: ACCENT, fontSize: 40, fontWeight: '900', lineHeight: 44 }}>
            {fmtMin(totalFocusThis)}
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 }}>Focus Time</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>This week · {DAYS[todayIdx]}</Text>
        </View>
        {delta !== null && <HeroBadge up={delta >= 0} delta={delta} />}
      </View>

      {/* Column chart */}
      <View style={{ flexDirection: 'row', gap: COL_GAP }}>
        {DAYS.map((label, i) => {
          const val      = focusThis[i];
          const lastVal  = focusLast[i];
          const isToday  = i === todayIdx;
          const isBest   = i === bestIdx && val > 0 && !isToday && nonZeroDays > 1;
          const isFuture = i > todayIdx;

          const barH    = val > 0 ? Math.max(5, Math.round((val / maxVal) * CHART_H)) : 0;
          const ghostH  = lastVal > 0 ? Math.max(4, Math.round((lastVal / maxVal) * CHART_H)) : 0;
          const barColor  = isBest ? '#FFD700' : ACCENT;
          const labelColor = isBest ? '#FFD700' : isToday ? ACCENT : colors.textMuted;
          const barOpacity = isFuture ? 0.18 : isToday ? 1 : 0.65;

          return (
            <View key={i} style={{ width: colW, alignItems: 'center' }}>
              <View style={{ height: 16, justifyContent: 'flex-end', marginBottom: 3 }}>
                {(isToday || isBest) && val > 0 && (
                  <Text style={{ color: barColor, fontSize: 8, fontWeight: '800', textAlign: 'center' }} numberOfLines={1}>
                    {fmtMin(val)}
                  </Text>
                )}
              </View>

              <View style={{ width: colW, height: CHART_H, position: 'relative' }}>
                {ghostH > 0 && (
                  <View style={{
                    position: 'absolute', bottom: 0,
                    left: '18%', right: '18%',
                    height: ghostH,
                    backgroundColor: '#2a1f6a',
                    borderTopLeftRadius: 3, borderTopRightRadius: 3,
                  }} />
                )}
                {barH > 0 ? (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: barH,
                    backgroundColor: barColor,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5,
                    opacity: barOpacity,
                  }} />
                ) : (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, backgroundColor: '#1a2535', borderRadius: 2,
                  }} />
                )}
              </View>

              <Text style={{ color: labelColor, fontSize: 10, fontWeight: isToday ? '900' : '500', marginTop: 6 }}>
                {label}
              </Text>
              {isToday && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT, marginTop: 3 }} />
              )}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: 14, marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: ACCENT }} />
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>This week</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#2a1f6a' }} />
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>Last week</Text>
        </View>
      </View>

      {focusThis[bestIdx] > 0 && (
        <InsightBar
          color="#FFD700"
          text={
            bestIdx === todayIdx
              ? `Today is your best day · ${fmtMin(focusThis[bestIdx])}`
              : `Best day: ${DAYS[bestIdx]} · ${fmtMin(focusThis[bestIdx])}`
          }
        />
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart 2 · Tasks Completed  (green / success)
// ─────────────────────────────────────────────────────────────────────────────
function TasksCard({ data }: { data: WeeklyChartData }) {
  const { tasks, todayIdx } = data;
  const colW   = useColW();
  const ACCENT = colors.success;

  const total       = tasks.reduce((a, b) => a + b, 0);
  const maxVal      = Math.max(...tasks, 1);
  const bestIdx     = tasks.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const nonZeroDays = tasks.filter((v) => v > 0).length;

  return (
    <Card style={{ marginBottom: spacing.md }}>
      {/* Hero */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.xl }}>
        <View>
          <Text style={{ color: ACCENT, fontSize: 40, fontWeight: '900', lineHeight: 44 }}>
            {total}
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 }}>Tasks Done</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>This week</Text>
        </View>
        {tasks[bestIdx] > 0 && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Best day</Text>
            <Text style={{ color: '#FFD700', fontSize: 22, fontWeight: '900', marginTop: 2 }}>{DAYS[bestIdx]}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 1 }}>
              {tasks[bestIdx]} task{tasks[bestIdx] !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Column chart */}
      <View style={{ flexDirection: 'row', gap: COL_GAP }}>
        {DAYS.map((label, i) => {
          const val      = tasks[i];
          const isToday  = i === todayIdx;
          const isBest   = i === bestIdx && val > 0 && !isToday && nonZeroDays > 1;
          const isFuture = i > todayIdx;

          const barH       = val > 0 ? Math.max(5, Math.round((val / maxVal) * CHART_H)) : 0;
          const barColor   = isBest ? '#FFD700' : ACCENT;
          const labelColor = isBest ? '#FFD700' : isToday ? ACCENT : colors.textMuted;
          const barOpacity = isFuture ? 0.18 : isToday ? 1 : 0.65;

          return (
            <View key={i} style={{ width: colW, alignItems: 'center' }}>
              <View style={{ height: 16, justifyContent: 'flex-end', marginBottom: 3 }}>
                {(isToday || isBest) && val > 0 && (
                  <Text style={{ color: barColor, fontSize: 9, fontWeight: '800', textAlign: 'center' }}>
                    {val}
                  </Text>
                )}
              </View>

              <View style={{ width: colW, height: CHART_H, position: 'relative' }}>
                {barH > 0 ? (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: barH,
                    backgroundColor: barColor,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5,
                    opacity: barOpacity,
                  }} />
                ) : (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, backgroundColor: '#1a2535', borderRadius: 2,
                  }} />
                )}
              </View>

              <Text style={{ color: labelColor, fontSize: 10, fontWeight: isToday ? '900' : '500', marginTop: 6 }}>
                {label}
              </Text>
              {isToday && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT, marginTop: 3 }} />
              )}
            </View>
          );
        })}
      </View>

      {tasks[bestIdx] > 0 && (
        <InsightBar
          color={ACCENT}
          text={
            bestIdx === todayIdx
              ? `Today is your best day · ${tasks[bestIdx]} task${tasks[bestIdx] !== 1 ? 's' : ''}`
              : `Most productive: ${DAYS[bestIdx]} · ${tasks[bestIdx]} task${tasks[bestIdx] !== 1 ? 's' : ''}`
          }
        />
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart 3 · Subtasks Done  (orange / warning)
// ─────────────────────────────────────────────────────────────────────────────
function SubtasksCard({ data }: { data: WeeklyChartData }) {
  const { subtasks, tasks, todayIdx } = data;
  const colW   = useColW();
  const ACCENT = '#F5A623';

  const maxSub      = Math.max(...subtasks, 1);
  const total       = subtasks.reduce((a, b) => a + b, 0);
  const totalTasks  = tasks.reduce((a, b) => a + b, 0);
  const avgRatio    = totalTasks > 0 ? (total / totalTasks).toFixed(1) : null;
  const bestIdx     = subtasks.reduce((bi, v, i, arr) => (v > arr[bi] ? i : bi), 0);
  const nonZeroDays = subtasks.filter((v) => v > 0).length;

  return (
    <Card style={{ marginBottom: spacing.md }}>
      {/* Hero */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.xl }}>
        <View>
          <Text style={{ color: ACCENT, fontSize: 40, fontWeight: '900', lineHeight: 44 }}>
            {total}
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 }}>Subtasks Done</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>This week</Text>
        </View>
        {avgRatio !== null && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Avg depth</Text>
            <Text style={{ color: ACCENT, fontSize: 22, fontWeight: '900', marginTop: 2 }}>×{avgRatio}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 1 }}>per task</Text>
          </View>
        )}
      </View>

      {/* Column chart */}
      <View style={{ flexDirection: 'row', gap: COL_GAP }}>
        {DAYS.map((label, i) => {
          const sub      = subtasks[i];
          const isToday  = i === todayIdx;
          const isBest   = i === bestIdx && sub > 0 && !isToday && nonZeroDays > 1;
          const isFuture = i > todayIdx;

          const barH       = sub > 0 ? Math.max(5, Math.round((sub / maxSub) * CHART_H)) : 0;
          const barColor   = isBest ? '#FFD700' : ACCENT;
          const labelColor = isBest ? '#FFD700' : isToday ? ACCENT : colors.textMuted;
          const barOpacity = isFuture ? 0.18 : isToday ? 1 : 0.65;

          return (
            <View key={i} style={{ width: colW, alignItems: 'center' }}>
              <View style={{ height: 16, justifyContent: 'flex-end', marginBottom: 3 }}>
                {(isToday || isBest) && sub > 0 && (
                  <Text style={{ color: barColor, fontSize: 9, fontWeight: '800', textAlign: 'center' }}>
                    {sub}
                  </Text>
                )}
              </View>

              <View style={{ width: colW, height: CHART_H, position: 'relative' }}>
                {barH > 0 ? (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: barH,
                    backgroundColor: barColor,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5,
                    opacity: barOpacity,
                  }} />
                ) : (
                  <View style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 3, backgroundColor: '#1a2535', borderRadius: 2,
                  }} />
                )}
              </View>

              <Text style={{ color: labelColor, fontSize: 10, fontWeight: isToday ? '900' : '500', marginTop: 6 }}>
                {label}
              </Text>
              {isToday && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: ACCENT, marginTop: 3 }} />
              )}
            </View>
          );
        })}
      </View>

      {subtasks[bestIdx] > 0 && (
        <InsightBar
          color={ACCENT}
          text={
            bestIdx === todayIdx
              ? `Today is your deepest day · ${subtasks[bestIdx]} subtasks`
              : `Deepest work: ${DAYS[bestIdx]} · ${subtasks[bestIdx]} subtasks` +
                (tasks[bestIdx] > 0 ? ` (×${(subtasks[bestIdx] / tasks[bestIdx]).toFixed(1)}/task)` : '')
          }
        />
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props { data: WeeklyChartData; }

export function RadialWeekChart({ data }: Props) {
  return (
    <>
      <FocusCard    data={data} />
      <TasksCard    data={data} />
      <SubtasksCard data={data} />
    </>
  );
}
