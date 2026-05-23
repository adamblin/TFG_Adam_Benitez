import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubtask } from '../../../services/tasks.service';
import type { Task } from '../../../services/tasks.service';

export function useUpdateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subtaskId, title }: { subtaskId: string; title: string }) =>
      updateSubtask(subtaskId, title),
    onMutate: async ({ subtaskId, title }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => ({
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, title } : s,
          ),
        })),
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
