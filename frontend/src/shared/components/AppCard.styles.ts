import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  base: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
