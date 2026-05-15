import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleSubtask, Task } from '../../../services/tasks.service';
import { useStreakCelebrationStore } from '../../../store/streak-celebration.store';

export function useToggleSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subtaskId, completed }: { taskId: string; subtaskId: string; completed: boolean }) =>
      toggleSubtask(subtaskId, completed),
    onMutate: async ({ taskId, subtaskId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      const now = new Date().toISOString();

      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((task) => {
          if (task.id !== taskId) return task;

          const updatedSubtasks = task.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed, updatedAt: now } : s
          );
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);
          const taskCompletionChanged = allDone !== task.completed;

          return {
            ...task,
            subtasks: updatedSubtasks,
            completed: allDone,
            completedAt: taskCompletionChanged ? (allDone ? now : null) : task.completedAt,
            updatedAt: taskCompletionChanged ? now : task.updatedAt,
          };
        })
      );

      return { previous };
    },
    onSuccess: () => {
      useStreakCelebrationStore.getState().show();
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['tasks'], ctx.previous);
      Alert.alert('Error', 'Could not update subtask. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
    },
  });
}
