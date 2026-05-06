import { useQuery } from '@tanstack/react-query';
import { getTasks, Task } from '../../../services/tasks.service';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 1,
  });
}
