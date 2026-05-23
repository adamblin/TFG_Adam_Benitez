import { ActivityIndicator, Pressable, Text } from 'react-native';
import { makeStyles } from './AppButton.styles';
import { useTheme } from '../theme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { alignItems: 'center', justifyContent: 'center' },
        pressed && !(disabled || loading) ? styles.pressed : null,
        disabled || loading ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}
