/**
 * Controla la celebración de racha diaria. Usa localStorage en web y AsyncStorage en nativo
 * (importado dinámicamente para evitar que el bundle web falle). `hydrateStreakStore` debe
 * llamarse al arrancar la app para restaurar la fecha de la última celebración.
 */
import { Platform } from 'react-native';
import { create } from 'zustand';

type StreakCelebrationState = {
  visible: boolean;
  lastCelebrationDate: string | null;
  show: () => void;
  dismiss: () => void;
  _setLastDate: (date: string) => void;
};

export const useStreakCelebrationStore = create<StreakCelebrationState>((set, get) => ({
  visible: false,
  lastCelebrationDate: null,

  show: () => {
    const today = new Date().toISOString().slice(0, 10);
    if (get().lastCelebrationDate === today) return;
    set({ visible: true, lastCelebrationDate: today });
    persistDate(today);
  },

  dismiss: () => set({ visible: false }),

  _setLastDate: (date) => set({ lastCelebrationDate: date }),
}));

const STORAGE_KEY = 'streak-celebration-date';

function persistDate(date: string) {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(STORAGE_KEY, date); } catch {}
  } else {
    import('@react-native-async-storage/async-storage')
      .then(({ default: AsyncStorage }) => AsyncStorage.setItem(STORAGE_KEY, date))
      .catch(() => {});
  }
}

export function hydrateStreakStore() {
  if (Platform.OS === 'web') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) useStreakCelebrationStore.getState()._setLastDate(saved);
    } catch {}
  } else {
    import('@react-native-async-storage/async-storage')
      .then(({ default: AsyncStorage }) => AsyncStorage.getItem(STORAGE_KEY))
      .then((saved) => {
        if (saved) useStreakCelebrationStore.getState()._setLastDate(saved);
      })
      .catch(() => {});
  }
}
