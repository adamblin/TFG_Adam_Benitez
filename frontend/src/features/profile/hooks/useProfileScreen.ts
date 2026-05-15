import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTasks } from '../../tasks/hooks/useTasks';
import { useFocusSessions } from '../../focus/hooks/useFocusSessions';
import { useStreak } from '../../streaks/hooks/useStreak';
import { useAuthStore } from '../../../store/auth.store';

export type ProfileStat = {
  label: string;
  value: string | number;
};

export type ProfileSummaryRow = {
  label: string;
  value: string | number;
};

function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function useProfileScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: tasks = [] } = useTasks();
  const { data: sessions = [] } = useFocusSessions();
  const { data: streak } = useStreak();

  const completedSessions = useMemo(() => sessions.filter((s) => s.completed), [sessions]);
  const totalFocusMin = useMemo(
    () => completedSessions.reduce((sum, s) => sum + s.durationMin, 0),
    [completedSessions]
  );
  const avgPerSession = useMemo(
    () =>
      completedSessions.length > 0
        ? Math.round(totalFocusMin / completedSessions.length)
        : 0,
    [totalFocusMin, completedSessions.length]
  );

  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const pendingTasks = useMemo(() => tasks.length - completedTasks, [tasks.length, completedTasks]);

  const stats = useMemo<ProfileStat[]>(
    () => [
      { label: 'Tasks', value: tasks.length },
      { label: 'Sessions', value: completedSessions.length },
      { label: 'Focus', value: formatMinutes(totalFocusMin) },
    ],
    [tasks.length, completedSessions.length, totalFocusMin]
  );

  const summaryRows = useMemo<ProfileSummaryRow[]>(
    () => [
      { label: 'Completed tasks', value: completedTasks },
      { label: 'Pending tasks', value: pendingTasks },
      { label: 'Average per session', value: avgPerSession > 0 ? formatMinutes(avgPerSession) : '—' },
    ],
    [completedTasks, pendingTasks, avgPerSession]
  );

  const recentSessions = useMemo(
    () =>
      completedSessions
        .slice()
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 5)
        .map((s) => {
          const date = new Date(s.startedAt);
          return `${s.durationMin} min · ${date.toLocaleDateString()}`;
        }),
    [completedSessions]
  );

  const avatarLetter = (currentUser?.username?.charAt(0) ?? 'U').toUpperCase();

  const handleLogout = () => {
    clearSession();
    router.replace('/auth/login');
  };

  return {
    currentUser,
    avatarLetter,
    stats,
    summaryRows,
    recentSessions,
    handleLogout,
  };
}
