import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  time: {
    color: colors.primary,
    fontSize: 64,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  status: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
});
