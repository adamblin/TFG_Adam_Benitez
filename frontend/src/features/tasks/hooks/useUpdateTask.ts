import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../../../services/tasks.service';
import type { Task } from '../../../services/tasks.service';
import { useStreakCelebrationStore } from '../../../store/streak-celebration.store';
import { getRandomPhrase } from '../../../services/motivational-phrases.service';
import { usePhraseModalStore } from '../../../store/phrase-modal.store';

function showStreakOrPhrase(category: 'TASK', emoji: string) {
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

/** Mutation para actualizar una tarea. Al completarla muestra celebración de racha o frase motivacional según si es la primera acción del día. */
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
    onSuccess: (_data, { data }) => {
      if (data.completed === true) {
        showStreakOrPhrase('TASK', '✅');
      }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['tasks'], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
}
