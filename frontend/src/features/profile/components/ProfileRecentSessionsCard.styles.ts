import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  item: {
    color: colors.text,
    fontSize: 13,
    paddingVertical: spacing.xs,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
