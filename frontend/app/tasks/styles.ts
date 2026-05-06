import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '../../src/shared/theme';

export default StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.lg },
  title: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  createForm: {
    flexDirection: 'row',
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonLabel: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 24,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: { color: colors.text, flex: 1 },
  itemDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  itemAction: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  itemActionDisabled: {
    opacity: 0.6,
  },
  itemActionLabel: { color: colors.text, fontWeight: '700' },
});
