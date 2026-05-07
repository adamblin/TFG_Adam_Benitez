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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
