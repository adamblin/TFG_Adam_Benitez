import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../services/api.client';
import type { Task } from '../../../services/tasks.service';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      return apiRequest<Task>(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ done: task.done }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
