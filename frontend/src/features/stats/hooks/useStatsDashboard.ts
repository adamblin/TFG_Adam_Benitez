import { useMemo, useState } from 'react';
import { useFocusSessions } from '../../focus/hooks/useFocusSessions';
import { useTasks } from '../../tasks/hooks/useTasks';
import { useStreak } from '../../streaks/hooks/useStreak';
import type { FocusSession } from '../../../services/focus.service';
import type { Task } from '../../../services/tasks.service';

export type StatsPeriod = 'weekly' | 'monthly' | 'annual';

export interface StatsKpi {
  id: string;
  label: string;
  value: string;
}

export interface CompletedTaskSummary {
  title: string;
  subtasks: string[];
}

export interface MonthlyDayCell {
  day: number | null;
  focus: number;
  tasks: number;
  subtasks: number;
  isToday?: boolean;
  taskSummaries?: CompletedTaskSummary[];
}

export interface TodayStats {
  label: string;
  focus: number;
  tasks: number;
  subtasks: number;
}

export interface HeatmapDay {
  date: Date | null;
  focus: number;
}

export interface AnnualHeatmapData {
  weeks: HeatmapDay[][];
  monthPositions: { label: string; weekIndex: number }[];
  maxFocus: number;
}

export interface BestDayData {
  labels: string[];
  data: number[];
  bestIdx: number;
}

export interface MomentumData {
  thisMonthFocus: number;
  lastMonthFocus: number;
  focusDelta: number | null;
  thisMonthTasks: number;
  lastMonthTasks: number;
  tasksDelta: number | null;
}

export interface WeeklyChartData {
  labels: string[];
  focusThis: number[];
  focusLast: number[];
  tasks: number[];
  subtasks: number[];
  todayIdx: number;
  totalFocusThis: number;
  totalFocusLast: number;
}

export interface WeekBreakdownItem {
  label: string;
  dateRange: string;
  focus: number;
  tasks: number;
  isCurrentWeek: boolean;
}

export interface MonthlyDailyPoint {
  day: number;
  focus: number;
  tasks: number;
  isToday: boolean;
}

interface Series {
  labels: string[];
  data: number[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear();
}

function startOfWeekMonday(ref: Date): Date {
  const d = new Date(ref);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatFocusTime(minutes: number): string {
  if (minutes === 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function focusOnDay(sessions: FocusSession[], day: Date): number {
  return sessions
    .filter((s) => s.completed && isSameDay(new Date(s.startedAt), day))
    .reduce((sum, s) => sum + s.durationMin, 0);
}

function tasksCompletedOnDay(tasks: Task[], day: Date): number {
  return tasks.filter(
    (t) => t.completedAt && isSameDay(new Date(t.completedAt), day)
  ).length;
}

function taskSummariesCompletedOnDay(tasks: Task[], day: Date): CompletedTaskSummary[] {
  return tasks
    .map((t) => {
      const taskDoneOnDay = t.completedAt && isSameDay(new Date(t.completedAt), day);
      const subsOnDay = t.subtasks.filter(
        (s) => s.completed && isSameDay(new Date(s.updatedAt), day)
      );
      if (!taskDoneOnDay && subsOnDay.length === 0) return null;
      return {
        title: t.title,
        subtasks: subsOnDay.length > 0
          ? subsOnDay.map((s) => s.title)
          : t.subtasks.filter((s) => s.completed).map((s) => s.title),
      };
    })
    .filter((s): s is CompletedTaskSummary => s !== null);
}

function subtasksCompletedOnDay(tasks: Task[], day: Date): number {
  return tasks.flatMap((t) => t.subtasks).filter(
    (s) => s.completed && isSameDay(new Date(s.updatedAt), day)
  ).length;
}

function buildAnnualHeatmap(sessions: FocusSession[], year: number): AnnualHeatmapData {
  // Pre-index sessions by date string for O(1) lookup
  const focusByDate = new Map<string, number>();
  sessions
    .filter((s) => s.completed)
    .forEach((s) => {
      const key = new Date(s.startedAt).toDateString();
      focusByDate.set(key, (focusByDate.get(key) ?? 0) + s.durationMin);
    });

  const jan1 = new Date(year, 0, 1);
  const dec31 = new Date(year, 11, 31);
  const startDate = startOfWeekMonday(jan1);
  const dec31Dow = dec31.getDay();
  const endDate = new Date(dec31);
  if (dec31Dow !== 0) endDate.setDate(dec31.getDate() + (7 - dec31Dow));

  const weeks: HeatmapDay[][] = [];
  const monthPositions: { label: string; weekIndex: number }[] = [];
  const seenMonths = new Set<number>();
  const cursor = new Date(startDate);
  let weekIndex = 0;

  while (cursor <= endDate) {
    const week: HeatmapDay[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(cursor);
      if (d.getFullYear() === year) {
        const focus = focusByDate.get(d.toDateString()) ?? 0;
        week.push({ date: d, focus });
        const m = d.getMonth();
        if (!seenMonths.has(m)) {
          seenMonths.add(m);
          monthPositions.push({ label: MONTH_LABELS[m], weekIndex });
        }
      } else {
        week.push({ date: null, focus: 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    weekIndex++;
  }

  const allFocus = weeks.flat().filter((d) => d.date !== null).map((d) => d.focus);
  return { weeks, monthPositions, maxFocus: Math.max(...allFocus, 1) };
}

function buildBestDayData(sessions: FocusSession[], year: number): BestDayData {
  const totals = Array(7).fill(0); // Mon=0 … Sun=6
  sessions
    .filter((s) => s.completed && new Date(s.startedAt).getFullYear() === year)
    .forEach((s) => {
      const dow = new Date(s.startedAt).getDay(); // 0=Sun JS convention
      const idx = dow === 0 ? 6 : dow - 1;
      totals[idx] += s.durationMin;
    });
  const bestIdx = totals.indexOf(Math.max(...totals));
  return { labels: DOW_LABELS, data: totals, bestIdx };
}

function buildMonthWeeks(
  sessions: FocusSession[],
  tasks: Task[],
  calendarDate: Date,
  actualToday: Date
): MonthlyDayCell[][] {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (MonthlyDayCell | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        day: i + 1,
        focus: focusOnDay(sessions, d),
        tasks: tasksCompletedOnDay(tasks, d),
        subtasks: subtasksCompletedOnDay(tasks, d),
        isToday: isSameDay(d, actualToday),
        taskSummaries: taskSummariesCompletedOnDay(tasks, d),
      };
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: MonthlyDayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(
      cells.slice(i, i + 7).map((c) => c ?? { day: null, focus: 0, tasks: 0, subtasks: 0 })
    );
  }
  return weeks;
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useStatsDashboard() {
  const [period, setPeriod] = useState<StatsPeriod>('weekly');
  const [monthOffset, setMonthOffset] = useState(0);
  const { data: sessions = [] } = useFocusSessions();
  const { data: tasks = [] } = useTasks();
  const { data: streak } = useStreak();

  const today = useMemo(() => new Date(), []);

  const calendarDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1),
    [today, monthOffset]
  );

  const todayStats = useMemo<TodayStats>(() => {
    const label = today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return {
      label,
      focus: focusOnDay(sessions, today),
      tasks: tasksCompletedOnDay(tasks, today),
      subtasks: subtasksCompletedOnDay(tasks, today),
    };
  }, [sessions, tasks, today]);

  const weeklySeries = useMemo<{ focus: Series; tasks: Series; subtasks: Series }>(() => {
    const weekStart = startOfWeekMonday(today);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
    return {
      focus: {
        labels: DOW_LABELS,
        data: days.map((d) => focusOnDay(sessions, d)),
      },
      tasks: {
        labels: DOW_LABELS,
        data: days.map((d) => tasksCompletedOnDay(tasks, d)),
      },
      subtasks: {
        labels: DOW_LABELS,
        data: days.map((d) => subtasksCompletedOnDay(tasks, d)),
      },
    };
  }, [sessions, tasks, today]);

  const annualSeries = useMemo<{ focus: Series; tasks: Series; subtasks: Series }>(() => {
    const year = today.getFullYear();
    return {
      focus: {
        labels: MONTH_LABELS,
        data: MONTH_LABELS.map((_, m) => {
          return sessions
            .filter((s) => {
              const d = new Date(s.startedAt);
              return s.completed && d.getFullYear() === year && d.getMonth() === m;
            })
            .reduce((sum, s) => sum + s.durationMin, 0);
        }),
      },
      tasks: {
        labels: MONTH_LABELS,
        data: MONTH_LABELS.map((_, m) =>
          tasks.filter((t) => {
            if (!t.completedAt) return false;
            const d = new Date(t.completedAt);
            return d.getFullYear() === year && d.getMonth() === m;
          }).length
        ),
      },
      subtasks: {
        labels: MONTH_LABELS,
        data: MONTH_LABELS.map((_, m) =>
          tasks
            .flatMap((t) => t.subtasks)
            .filter((s) => {
              const d = new Date(s.updatedAt);
              return s.completed && d.getFullYear() === year && d.getMonth() === m;
            }).length
        ),
      },
    };
  }, [sessions, tasks, today]);

  const weeklyChartData = useMemo<WeeklyChartData>(() => {
    const dow = today.getDay();
    const todayIdx = dow === 0 ? 6 : dow - 1; // Mon=0 … Sun=6

    const thisWeekStart = startOfWeekMonday(today);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const days = Array.from({ length: 7 }, (_, i) => {
      const t = new Date(thisWeekStart);
      t.setDate(thisWeekStart.getDate() + i);
      const l = new Date(lastWeekStart);
      l.setDate(lastWeekStart.getDate() + i);
      return { t, l };
    });

    const focusThis = days.map(({ t }) => focusOnDay(sessions, t));
    const focusLast = days.map(({ l }) => focusOnDay(sessions, l));
    const tasksList = days.map(({ t }) => tasksCompletedOnDay(tasks, t));
    const subtasksList = days.map(({ t }) => subtasksCompletedOnDay(tasks, t));

    return {
      labels: DOW_LABELS,
      focusThis,
      focusLast,
      tasks: tasksList,
      subtasks: subtasksList,
      todayIdx,
      totalFocusThis: focusThis.reduce((a, b) => a + b, 0),
      totalFocusLast: focusLast.reduce((a, b) => a + b, 0),
    };
  }, [sessions, tasks, today]);

  const monthWeeklyBreakdown = useMemo<WeekBreakdownItem[]>(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    let cursor = startOfWeekMonday(firstDay);
    const result: WeekBreakdownItem[] = [];
    let wNum = 1;

    while (cursor <= lastDay) {
      const weekEnd = new Date(cursor);
      weekEnd.setDate(cursor.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const rangeStart = new Date(Math.max(cursor.getTime(), firstDay.getTime()));
      const rangeEnd   = new Date(Math.min(weekEnd.getTime(), lastDay.getTime()));

      const focus = sessions
        .filter((s) => {
          const d = new Date(s.startedAt);
          return s.completed && d >= rangeStart && d <= rangeEnd;
        })
        .reduce((sum, s) => sum + s.durationMin, 0);

      const tasksDone = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const d = new Date(t.completedAt);
        return d >= rangeStart && d <= rangeEnd;
      }).length;

      result.push({
        label: `W${wNum}`,
        dateRange: `${rangeStart.getDate()}–${rangeEnd.getDate()}`,
        focus,
        tasks: tasksDone,
        isCurrentWeek: today >= cursor && today <= weekEnd,
      });

      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 7);
      wNum++;
    }
    return result;
  }, [sessions, tasks, today]);

  const annualHeatmap = useMemo<AnnualHeatmapData>(
    () => buildAnnualHeatmap(sessions, today.getFullYear()),
    [sessions, today]
  );

  const activeDays = useMemo(
    () => annualHeatmap.weeks.flat().filter((d) => d.date !== null && d.focus > 0).length,
    [annualHeatmap]
  );

  const bestDayData = useMemo<BestDayData>(
    () => buildBestDayData(sessions, today.getFullYear()),
    [sessions, today]
  );

  const momentumData = useMemo<MomentumData>(() => {
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonthFocus = sessions
      .filter((s) => s.completed && isSameMonth(new Date(s.startedAt), today))
      .reduce((sum, s) => sum + s.durationMin, 0);
    const lastMonthFocus = sessions
      .filter((s) => s.completed && isSameMonth(new Date(s.startedAt), lastMonthDate))
      .reduce((sum, s) => sum + s.durationMin, 0);
    const thisMonthTasks = tasks.filter(
      (t) => t.completedAt && isSameMonth(new Date(t.completedAt), today)
    ).length;
    const lastMonthTasks = tasks.filter(
      (t) => t.completedAt && isSameMonth(new Date(t.completedAt), lastMonthDate)
    ).length;
    const focusDelta = lastMonthFocus > 0
      ? Math.round(((thisMonthFocus - lastMonthFocus) / lastMonthFocus) * 100)
      : null;
    const tasksDelta = lastMonthTasks > 0
      ? Math.round(((thisMonthTasks - lastMonthTasks) / lastMonthTasks) * 100)
      : null;
    return { thisMonthFocus, lastMonthFocus, focusDelta, thisMonthTasks, lastMonthTasks, tasksDelta };
  }, [sessions, tasks, today]);

  const monthlyCalendar = useMemo(() => {
    const weeks = buildMonthWeeks(sessions, tasks, calendarDate, today);
    const title = calendarDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    return { title, weeks };
  }, [sessions, tasks, calendarDate, today]);

  const monthlyDailyData = useMemo<MonthlyDailyPoint[]>(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        day: i + 1,
        focus: focusOnDay(sessions, d),
        tasks: tasksCompletedOnDay(tasks, d),
        isToday: isSameDay(d, today),
      };
    });
  }, [sessions, tasks, calendarDate, today]);

  const kpis = useMemo<StatsKpi[]>(() => {
    if (period === 'weekly') {
      const weekStart = startOfWeekMonday(today);
      const weekFocus = sessions
        .filter((s) => {
          const d = new Date(s.startedAt);
          return s.completed && d >= weekStart && d <= today;
        })
        .reduce((sum, s) => sum + s.durationMin, 0);
      const weekTasks = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const d = new Date(t.completedAt);
        return d >= weekStart && d <= today;
      }).length;
      const totalWeekTasks = tasks.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= weekStart && d <= today;
      }).length;
      const rate = totalWeekTasks > 0 ? Math.round((weekTasks / totalWeekTasks) * 100) : 0;
      return [
        { id: 'minutes', label: 'Focus Time', value: formatFocusTime(weekFocus) },
        { id: 'tasks', label: 'Tasks Done', value: String(weekTasks) },
        { id: 'rate', label: 'Completion Rate', value: `${rate}%` },
        { id: 'streak', label: 'Current Streak', value: `${streak?.currentStreak ?? 0} days` },
      ];
    }

    if (period === 'monthly') {
      const monthFocus = sessions
        .filter((s) => s.completed && isSameMonth(new Date(s.startedAt), today))
        .reduce((sum, s) => sum + s.durationMin, 0);
      const monthTasks = tasks.filter(
        (t) => t.completedAt && isSameMonth(new Date(t.completedAt), today)
      ).length;
      const totalMonthTasks = tasks.filter((t) =>
        isSameMonth(new Date(t.createdAt), today)
      ).length;
      const rate = totalMonthTasks > 0 ? Math.round((monthTasks / totalMonthTasks) * 100) : 0;
      return [
        { id: 'minutes', label: 'Focus Time', value: formatFocusTime(monthFocus) },
        { id: 'tasks', label: 'Tasks Done', value: String(monthTasks) },
        { id: 'rate', label: 'Completion Rate', value: `${rate}%` },
        { id: 'streak', label: 'Best Streak', value: `${streak?.longestStreak ?? 0} days` },
      ];
    }

    const yearFocus = sessions
      .filter((s) => s.completed && isSameYear(new Date(s.startedAt), today))
      .reduce((sum, s) => sum + s.durationMin, 0);
    const yearTasks = tasks.filter(
      (t) => t.completedAt && isSameYear(new Date(t.completedAt), today)
    ).length;
    const totalYearTasks = tasks.filter((t) => isSameYear(new Date(t.createdAt), today)).length;
    const rate = totalYearTasks > 0 ? Math.round((yearTasks / totalYearTasks) * 100) : 0;
    return [
      { id: 'minutes', label: 'Focus Time', value: formatFocusTime(yearFocus) },
      { id: 'tasks', label: 'Tasks Done', value: String(yearTasks) },
      { id: 'rate', label: 'Completion Rate', value: `${rate}%` },
      { id: 'streak', label: 'Best Streak', value: `${streak?.longestStreak ?? 0} days` },
    ];
  }, [period, sessions, tasks, streak, today]);

  return {
    period,
    setPeriod,
    kpis,
    focusSeries: period === 'annual' ? annualSeries.focus : weeklySeries.focus,
    tasksSeries: period === 'annual' ? annualSeries.tasks : weeklySeries.tasks,
    subtasksSeries: period === 'annual' ? annualSeries.subtasks : weeklySeries.subtasks,
    monthlyCalendar,
    today: todayStats,
    prevMonth: () => setMonthOffset((o) => o - 1),
    nextMonth: () => setMonthOffset((o) => Math.min(o + 1, 0)),
    canGoNext: monthOffset < 0,
    annualHeatmap,
    activeDays,
    bestDayData,
    momentumData,
    weeklyChartData,
    monthWeeklyBreakdown,
    monthlyDailyData,
  };
}
