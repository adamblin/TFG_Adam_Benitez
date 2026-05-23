import { useThemeStore } from '../../store/theme.store';
import type { ColorPalette } from './palettes/palette.types';

export function useTheme(): ColorPalette {
  return useThemeStore((s) => s.palette);
}
