import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0f1729',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  board: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: '#0f1729',
    padding: spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  dayCard: {
    flex: 1,
    backgroundColor: '#142238',
    borderColor: '#22314a',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dayCardToday: {
    backgroundColor: '#1d2d47',
    borderColor: '#8ab4f8',
  },
  dayHeader: {
    marginBottom: spacing.xs,
  },
  dayLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  dayNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  todayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8ab4f8',
  },
  barWrap: {
    height: 74,
    justifyContent: 'flex-end',
  },
  barBackground: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#20314c',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 999,
  },
  metricsRow: {
    marginTop: spacing.sm,
    gap: 2,
  },
  metricText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  labelText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
});
