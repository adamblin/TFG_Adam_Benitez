import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../services/api.client';
import type { Task } from '../../../services/tasks.service';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      return apiRequest<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
