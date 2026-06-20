/** Almacena la sesión activa del usuario (tokens JWT + datos del usuario). Se limpia al hacer logout. */
import { create } from 'zustand';
import type { CurrentUserResponse } from '../services/auth.service';

type AuthState = {
  accessToken: string;
  refreshToken: string;
  currentUser: CurrentUserResponse | null;
  needsUsername: boolean;
  setSession: (input: {
    accessToken: string;
    refreshToken: string;
    currentUser: CurrentUserResponse;
    needsUsername?: boolean;
  }) => void;
  setNeedsUsername: (value: boolean) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: '',
  refreshToken: '',
  currentUser: null,
  needsUsername: false,
  setSession: ({ accessToken, refreshToken, currentUser, needsUsername = false }) =>
    set({ accessToken, refreshToken, currentUser, needsUsername }),
  setNeedsUsername: (value) => set({ needsUsername: value }),
  clearSession: () =>
    set({ accessToken: '', refreshToken: '', currentUser: null, needsUsername: false }),
}));
