import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTasks } from '../../tasks/hooks/useTasks';
import { useAuthStore } from '../../../store/auth.store';

export type ProfileStat = {
  label: string;
  value: string | number;
};

export type ProfileSummaryRow = {
  label: string;
  value: string | number;
};

export function useProfileScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: tasks = [] } = useTasks();

  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const pendingTasks = useMemo(() => tasks.length - completedTasks, [tasks.length, completedTasks]);

  const stats = useMemo<ProfileStat[]>(
    () => [
      { label: 'Tasks', value: tasks.length },
      { label: 'Sessions', value: 0 },
      { label: 'Focus', value: '0m' },
    ],
    [tasks.length]
  );

  const summaryRows = useMemo<ProfileSummaryRow[]>(
    () => [
      { label: 'Completed tasks', value: completedTasks },
      { label: 'Pending tasks', value: pendingTasks },
      { label: 'Average per session', value: '0m' },
    ],
    [completedTasks, pendingTasks]
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
    recentSessions: [] as string[],
    handleLogout,
  };
}
