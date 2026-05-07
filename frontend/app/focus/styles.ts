import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../src/shared/theme';

export const styles = StyleSheet.create({
  subtaskCard: {
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  subtaskText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  anotherTaskCard: {
    marginBottom: spacing.lg,
  },
  anotherTaskTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  anotherTaskSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
