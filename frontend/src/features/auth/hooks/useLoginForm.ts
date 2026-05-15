import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, login, register } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';

export type FormMode = 'login' | 'register';

export type FormMessage = {
  text: string;
  type: 'success' | 'error';
};

const DEV_DEFAULTS = __DEV__
  ? {
      email: 'test_user@example.com',
      username: 'test_user',
      password: 'password123',
    }
  : {
      email: '',
      username: '',
      password: '',
    };

export function useLoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState(DEV_DEFAULTS.email);
  const [username, setUsername] = useState(DEV_DEFAULTS.username);
  const [password, setPassword] = useState(DEV_DEFAULTS.password);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'register') {
        await register({
          email,
          username,
          password,
        });

        setMessage({ text: 'Registered successfully. You can now log in.', type: 'success' });
        setMode('login');
        return;
      }

      const result = await login({ username, password });
      const currentUser = await getCurrentUser(result.token);
      setSession({
        accessToken: result.token,
        refreshToken: result.refreshToken,
        currentUser,
      });
      router.replace('/home');
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Unexpected error',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
