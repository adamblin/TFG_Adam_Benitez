import { useQuery } from '@tanstack/react-query';
import { getUserXP, LevelInfo } from '../../../services/xp.service';

export function useUserXP() {
  return useQuery<LevelInfo>({
    queryKey: ['user-xp'],
    queryFn: getUserXP,
    staleTime: 1000 * 30,
  });
}
