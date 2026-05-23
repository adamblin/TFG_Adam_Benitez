import { StyleSheet } from 'react-native';
import { type ColorPalette } from '../theme';

export const makeStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 6,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
