import { create } from 'zustand';

type FocusSessionState = {
  isActive: boolean;
  abortFn: (() => Promise<void>) | null;
  activate: (abortFn: () => Promise<void>) => void;
  deactivate: () => void;
};

export const useFocusSessionStore = create<FocusSessionState>((set) => ({
  isActive: false,
  abortFn: null,
  activate: (abortFn) => set({ isActive: true, abortFn }),
  deactivate: () => set({ isActive: false, abortFn: null }),
}));
