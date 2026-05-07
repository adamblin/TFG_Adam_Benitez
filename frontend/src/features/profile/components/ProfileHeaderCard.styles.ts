import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarLetter: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  username: {
    color: colors.text,
    fontSize: 33,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  userId: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
