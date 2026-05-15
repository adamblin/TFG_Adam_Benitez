import { create } from 'zustand';

type StreakCelebrationState = {
  visible: boolean;
  lastCelebrationDate: string | null;
  show: () => void;
  dismiss: () => void;
};

export const useStreakCelebrationStore = create<StreakCelebrationState>((set, get) => ({
  visible: false,
  lastCelebrationDate: null,

  show: () => {
    const today = new Date().toISOString().slice(0, 10);
    if (get().lastCelebrationDate === today) return;
    set({ visible: true, lastCelebrationDate: today });
  },

  dismiss: () => set({ visible: false }),
}));
