import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  switchButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  switchButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});
