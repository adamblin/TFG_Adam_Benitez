import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 28,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '900',
      marginBottom: 6,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 24,
      lineHeight: 20,
    },
    label: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 15,
      marginBottom: 20,
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
      marginBottom: 16,
      marginTop: -12,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonLabel: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
    },
  });
