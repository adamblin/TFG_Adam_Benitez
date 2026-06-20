import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../shared/theme';
import { makeStyles } from './GoogleAuthButton.styles';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export function GoogleAuthButton() {
  const colors = useTheme();
  const styles = makeStyles(colors);
  const { promptAsync, disabled, loading } = useGoogleAuth();

  return (
    <>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        onPress={() => promptAsync()}
        disabled={disabled}
        style={[styles.button, disabled && styles.buttonDisabled]}
        activeOpacity={0.75}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.label}>Continue with Google</Text>
        )}
      </TouchableOpacity>
    </>
  );
}
