import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSubtask, Task } from '../../../services/tasks.service';

export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subtaskId }: { taskId: string; subtaskId: string }) =>
      deleteSubtask(subtaskId),
    onMutate: async ({ taskId, subtaskId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: task.subtasks.filter((s) => s.id !== subtaskId) }
            : task
        )
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
