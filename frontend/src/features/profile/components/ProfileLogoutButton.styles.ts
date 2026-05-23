import { StyleSheet } from 'react-native';
import { type ColorPalette, spacing } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '800',
  },
});
