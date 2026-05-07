import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
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
