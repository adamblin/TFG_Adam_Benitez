import { Text } from 'react-native';
import { styles } from './LoginForm.styles';
import { AppButton, AppField, FormShell } from '../../../shared/components';
import { useLoginForm } from '../hooks/useLoginForm';
import { FormModeSwitcher } from './FormModeSwitcher';
import { FormHeader } from './FormHeader';

const DEV_PLACEHOLDERS = __DEV__
  ? {
      email: 'test_user@example.com',
      username: 'test_user',
      passwordLogin: 'password123',
      passwordRegister: 'password1234',
    }
  : {
      email: '',
      username: '',
      passwordLogin: '',
      passwordRegister: '',
    };

export function LoginForm() {
  const {
    mode,
    setMode,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    message,
    handleSubmit,
  } = useLoginForm();

  return (
    <FormShell>
      <FormHeader mode={mode} />
      <FormModeSwitcher mode={mode} onChange={setMode} />

      {mode === 'register' && (
        <AppField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder={DEV_PLACEHOLDERS.email}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
      )}

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
        placeholder={
          mode === 'login'
            ? DEV_PLACEHOLDERS.passwordLogin
            : DEV_PLACEHOLDERS.passwordRegister
        }
        secureTextEntry
      />

      <AppButton
        onPress={handleSubmit}
        disabled={loading}
        loading={loading}
        label={mode === 'login' ? 'Sign in' : 'Create account'}
      />

      {!!message && (
        <Text style={[styles.message, message.type === 'success' ? styles.messageSuccess : styles.messageError]}>
          {message.text}
        </Text>
      )}
    </FormShell>
  );
}


