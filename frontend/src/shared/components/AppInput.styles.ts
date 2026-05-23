import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  base: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
  },
});
