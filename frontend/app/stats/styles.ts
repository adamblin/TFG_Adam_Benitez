import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../src/shared/theme';

export const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  sectionSpacing: {
    marginBottom: spacing.md,
  },
});
