import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  cardSpacing: {
    marginBottom: spacing.md,
  },
  legendRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  annualHeader: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  monthItem: {
    width: '31%',
    backgroundColor: '#142238',
    borderRadius: 10,
    padding: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
  },
  monthLabel: {
    color: colors.text,
    fontSize: 11,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  dotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
});
