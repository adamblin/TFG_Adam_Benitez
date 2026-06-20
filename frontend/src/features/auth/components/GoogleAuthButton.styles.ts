import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../../../shared/theme';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
      gap: 10,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 13,
      backgroundColor: colors.surface,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    googleLogo: {
      width: 20,
      height: 20,
    },
    label: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
  });
