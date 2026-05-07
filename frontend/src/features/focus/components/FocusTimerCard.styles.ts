import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  time: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  status: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
