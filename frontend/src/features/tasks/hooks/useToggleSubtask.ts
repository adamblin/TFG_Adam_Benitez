import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleSubtask, Task } from '../../../services/tasks.service';
import { useStreakCelebrationStore } from '../../../store/streak-celebration.store';
import { getRandomPhrase } from '../../../services/motivational-phrases.service';
import { usePhraseModalStore } from '../../../store/phrase-modal.store';

function showStreakOrPhrase(category: 'SUBTASK', emoji: string) {
  const streakStore = useStreakCelebrationStore.getState();
  const today = new Date().toISOString().slice(0, 10);
  const isFirstToday = streakStore.lastCelebrationDate !== today;

  streakStore.show();

  if (!isFirstToday) {
    getRandomPhrase(category)
      .then(({ text }) => usePhraseModalStore.getState().show(text, emoji))
      .catch(() => {});
  }
}

/** Mutation para marcar/desmarcar una subtarea. Al completarla por primera vez en el día muestra la celebración de racha; en otros casos muestra una frase motivacional. */
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
    onSuccess: (_data, { completed }) => {
      if (completed) {
        showStreakOrPhrase('SUBTASK', '🎯');
      }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['tasks'], ctx.previous);
      Alert.alert('Error', 'Could not update subtask. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
}
