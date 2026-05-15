import { useQuery } from '@tanstack/react-query';
import { getStreak, Streak } from '../../../services/streaks.service';

export function useStreak() {
  return useQuery<Streak>({
    queryKey: ['streak'],
    queryFn: getStreak,
  });
}
