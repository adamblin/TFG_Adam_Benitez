import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  listColumn: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardWrap: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
