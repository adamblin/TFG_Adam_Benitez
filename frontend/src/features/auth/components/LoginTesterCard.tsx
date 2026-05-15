import {
  Text,
} from 'react-native';
import { AppButton, AppField, FormShell } from '../../../shared/components';
import { useLoginTester } from '../hooks/useLoginTester';
import { styles } from './LoginTesterCard.styles';
import { FormHeader } from './FormHeader';

const DEV_PLACEHOLDERS = __DEV__
  ? {
      username: 'test_user',
      password: 'password123',
    }
  : {
      username: '',
      password: '',
    };

export function LoginTesterCard() {
  const { username, password, loading, message, token, setUsername, setPassword, handleLogin } =
    useLoginTester();

  return (
    <FormShell>
      <FormHeader
        badgeLabel="LOGIN TEST"
        title="Log in to your account"
        subtitle="Simple form to test your backend with JWT."
      />

      <AppField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder={DEV_PLACEHOLDERS.username}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AppField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder={DEV_PLACEHOLDERS.password}
        secureTextEntry
      />

      <AppButton
        onPress={handleLogin}
        disabled={loading}
        loading={loading}
        label="Log in"
      />

      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!token && <Text style={styles.message}>Token received.</Text>}
    </FormShell>
  );
}