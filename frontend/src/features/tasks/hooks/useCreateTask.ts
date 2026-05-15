import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../../services/tasks.service';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, dueDate }: { title: string; dueDate?: string }) =>
      createTask(title, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
