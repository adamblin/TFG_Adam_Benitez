import { StyleSheet } from 'react-native';
import { type ColorPalette, spacing } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
  },
  username: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  userId: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});
