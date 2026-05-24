/** Controla la visibilidad del modal de frases motivacionales y el texto/emoji que muestra. */
import { create } from 'zustand';

type PhraseModalState = {
  visible: boolean;
  text: string;
  emoji: string;
  show: (text: string, emoji: string) => void;
  hide: () => void;
};

export const usePhraseModalStore = create<PhraseModalState>((set) => ({
  visible: false,
  text: '',
  emoji: '',
  show: (text, emoji) => set({ visible: true, text, emoji }),
  hide: () => set({ visible: false }),
}));
