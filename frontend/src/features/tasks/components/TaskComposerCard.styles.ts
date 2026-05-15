import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 3,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.surface,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.text,
  },
  input: {
    minHeight: 80,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
    marginBottom: spacing.sm,
    textAlignVertical: 'top',
  },
  titleInput: {
    minHeight: 0,
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  subtaskSection: {
    marginBottom: spacing.md,
  },
  subtaskSectionLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtaskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  subtaskInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.error + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: colors.error,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  addSubtaskRow: {
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  addSubtaskText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
