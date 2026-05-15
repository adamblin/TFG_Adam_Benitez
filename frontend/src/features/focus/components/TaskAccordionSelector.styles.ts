import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  taskCard: {
    borderLeftWidth: 5,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    gap: spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandIcon: {
    fontSize: 32,
    fontWeight: '300',
    paddingTop: 4,
  },
  subtasksContainer: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  subtaskCard: {
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  subtaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  subtaskCheckmark: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
});
