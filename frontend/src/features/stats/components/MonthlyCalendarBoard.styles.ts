import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  board: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: '#0f1729',
  },
  monthHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#22314a',
  },
  monthTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#22314a',
  },
  dayHeader: {
    width: 128,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#22314a',
  },
  dayHeaderText: {
    color: '#9cb5d4',
    fontWeight: '700',
    fontSize: 12,
  },
  weekRow: {
    flexDirection: 'row',
    minHeight: 124,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2235',
  },
  dayCell: {
    width: 128,
    borderRightWidth: 1,
    borderRightColor: '#22314a',
    padding: spacing.sm,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  todayBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8ab4f8',
    textAlign: 'center',
    lineHeight: 28,
    color: colors.background,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  eventLabel: {
    color: '#e5ebf5',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  mutedDay: {
    opacity: 0.45,
  },
});
