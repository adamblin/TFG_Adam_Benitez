import { useQuery } from '@tanstack/react-query';
import { getFocusSessions, FocusSession } from '../../../services/focus.service';

export function useFocusSessions() {
  return useQuery<FocusSession[]>({
    queryKey: ['focus-sessions'],
    queryFn: getFocusSessions,
  });
}
