import { create } from 'zustand';

export const ICON_COLORS: Record<string, string> = {
  icon_blue:   '#007AFF',
  icon_red:    '#FF3B30',
  icon_green:  '#34C759',
  icon_purple: '#5856D6',
  icon_orange: '#FF9500',
  icon_pink:   '#FF2D55',
  icon_gold:   '#C8960C',
};

export const THEME_COLORS: Record<string, string> = {
  theme_blue:   '#007AFF',
  theme_green:  '#34C759',
  theme_purple: '#5856D6',
  theme_orange: '#FF9500',
  theme_teal:   '#5AC8FA',
  theme_rose:   '#FF2D55',
};

type ThemeState = {
  primaryColor: string;
  iconColor: string;
  setPreferences: (prefs: { theme: string; iconColor: string }) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: '#007AFF',
  iconColor: '#007AFF',
  setPreferences: ({ theme, iconColor }) =>
    set({
      primaryColor: THEME_COLORS[theme] ?? '#007AFF',
      iconColor: ICON_COLORS[iconColor] ?? '#007AFF',
    }),
}));
