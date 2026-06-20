import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../shared/theme';
import { makeStyles } from './CompleteProfileModal.styles';
import { completeProfile, getCurrentUser } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';

export function CompleteProfileModal() {
  const colors = useTheme();
  const styles = makeStyles(colors);

  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
      setError('Only letters, numbers, dots, underscores and hyphens allowed');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await completeProfile(trimmed);
      const updatedUser = await getCurrentUser(result.token);
      setSession({
        accessToken: result.token,
        refreshToken: result.refreshToken,
        currentUser: updatedUser,
        needsUsername: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>One last step</Text>
          <Text style={styles.subtitle}>
            Choose a username to complete your profile. You can always change it later.
          </Text>

          <Text style={styles.label}>USERNAME</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(v) => { setUsername(v); setError(null); }}
            placeholder="e.g. john_doe"
            placeholderTextColor={colors.placeholderText}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || username.trim().length < 3}
            style={[styles.button, (loading || username.trim().length < 3) && styles.buttonDisabled]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonLabel}>Save username</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
