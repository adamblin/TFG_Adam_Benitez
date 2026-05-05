import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../../shared/theme';

export const styles = StyleSheet.create({
  message: {
    marginTop: spacing.lg,
    ...typography.body,
  },
});