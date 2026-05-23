import { StyleSheet } from 'react-native';
import { type ColorPalette, spacing } from '../../src/shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  sectionSpacing: {
    marginBottom: spacing.md,
  },
});
