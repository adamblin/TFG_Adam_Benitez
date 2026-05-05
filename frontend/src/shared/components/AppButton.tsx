import { ActivityIndicator, Pressable, Text } from 'react-native';
import { styles } from './AppButton.styles';
import { colors } from '../theme';

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
