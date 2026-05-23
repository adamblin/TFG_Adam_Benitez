import { StyleSheet } from 'react-native';
import { type ColorPalette, spacing } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});
