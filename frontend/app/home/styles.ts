import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '../../src/shared/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: typography.heading.color,
    fontSize: typography.heading.fontSize,
    fontWeight: typography.heading.fontWeight,
    marginBottom: 6,
  },
  subtitle: {
    color: typography.subtitle.color,
    fontSize: typography.subtitle.fontSize,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardBody: {
    color: colors.textMuted,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: colors.text,
    fontWeight: '800',
  },
});
