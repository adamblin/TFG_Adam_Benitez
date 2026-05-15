import { useState } from 'react';
import { login } from '../../../services/auth.service';

type UseLoginTesterState = {
  username: string;
  password: string;
  loading: boolean;
  message: string;
  token: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: () => Promise<void>;
};

export function useLoginTester(): UseLoginTesterState {
  const [username, setUsername] = useState('test_user');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    setToken('');

    try {
      const data = await login({ username: username.trim(), password });
      setToken(data.token);
      setMessage('Login successful. Token received.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    password,
    loading,
    message,
    token,
    setUsername,
    setPassword,
    handleLogin,
  };
}