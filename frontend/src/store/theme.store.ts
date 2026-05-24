/** Almacena las preferencias visuales del usuario (paleta de color de la app y color del avatar). Se actualiza al entrar en la app y al comprar en la tienda. */
import { create } from 'zustand';
import { type ColorPalette, oceanPalette, resolveTheme } from '../shared/theme/palettes';

export const ICON_COLORS: Record<string, string> = {
  icon_blue:     '#007AFF',
  icon_gray:     '#8E8E93',
  icon_slate:    '#64748B',
  icon_stone:    '#78716C',
  icon_red:      '#FF3B30',
  icon_green:    '#34C759',
  icon_orange:   '#FF9500',
  icon_yellow:   '#FFCC00',
  icon_cyan:     '#32ADE6',
  icon_navy:     '#1D3461',
  icon_brown:    '#A0522D',
  icon_purple:   '#5856D6',
  icon_pink:     '#FF2D55',
  icon_teal:     '#30B0C7',
  icon_indigo:   '#3F3FBF',
  icon_lime:     '#30D158',
  icon_coral:    '#FF6B6B',
  icon_rose:     '#E91E63',
  icon_sky:      '#0EA5E9',
  icon_gold:     '#C8960C',
  icon_crimson:  '#C8002A',
  icon_violet:   '#BF5AF2',
  icon_emerald:  '#00B894',
  icon_azure:    '#0080FF',
  icon_midnight: '#1A1A4E',
  icon_ruby:     '#E0115F',
  icon_solar:    '#FF6D00',
  icon_cosmic:   '#7B2FBE',
  icon_platinum: '#96A8B2',
  icon_neon:     '#0FFF50',
  icon_aurora:   '#00FFAB',
  icon_obsidian: '#3D0066',
};

type ThemeState = {
  palette: ColorPalette;
  iconColor: string;
  setPreferences: (prefs: { theme: string; iconColor: string }) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  palette:   oceanPalette,
  iconColor: '#007AFF',
  setPreferences: ({ theme, iconColor }) =>
    set({
      palette:   resolveTheme(theme),
      iconColor: ICON_COLORS[iconColor] ?? '#007AFF',
    }),
}));
