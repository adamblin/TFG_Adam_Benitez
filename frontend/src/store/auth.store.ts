import { create } from 'zustand';
import type { CurrentUserResponse } from '../services/auth.service';

type AuthState = {
  accessToken: string;
  refreshToken: string;
  currentUser: CurrentUserResponse | null;
  setSession: (input: {
    accessToken: string;
    refreshToken: string;
    currentUser: CurrentUserResponse;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: '',
  refreshToken: '',
  currentUser: null,
  setSession: ({ accessToken, refreshToken, currentUser }) =>
    set({ accessToken, refreshToken, currentUser }),
  clearSession: () => set({ accessToken: '', refreshToken: '', currentUser: null }),
}));
