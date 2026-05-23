import { StyleSheet } from 'react-native';
import { type ColorPalette, radii, spacing } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
  },
  optionLabel: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  optionLabelSelected: {
    color: colors.background,
  },
});
