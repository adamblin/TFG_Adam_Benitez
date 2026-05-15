import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../../../services/tasks.service';
import type { Task } from '../../../services/tasks.service';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'dueDate'>> }) =>
      updateTask(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => {
          if (t.id !== taskId) return t;
          const updated = { ...t, ...data };
          if (data.completed === true && !t.completed) {
            updated.completedAt = new Date().toISOString();
          } else if (data.completed === false && t.completed) {
            updated.completedAt = null;
          }
          return updated;
        })
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['tasks'], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
