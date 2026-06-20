import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';

WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export function useGoogleAuth() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptAsync = async () => {
    setLoading(true);
    setError(null);

    try {
      const isWeb = Platform.OS === 'web';

      if (isWeb) {
        // Web: full-page redirect — the success page will finish the flow
        window.location.href = `${API_URL}/auth/google/init?platform=web`;
        return;
      }

      // Native (iOS / Android via Expo Go or dev build)
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/auth/google/init?platform=native`,
        'tfgapp://',
      );

      if (result.type !== 'success') {
        setLoading(false);
        return;
      }

      await handleCallbackUrl(result.url, setSession, router);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return { promptAsync, disabled: loading, loading, error };
}

type SetSession = (input: {
  accessToken: string;
  refreshToken: string;
  currentUser: { id: string; username: string };
  needsUsername?: boolean;
}) => void;

export async function handleCallbackUrl(
  url: string,
  setSession: SetSession,
  router: ReturnType<typeof useRouter>,
) {
  const parsed = new URL(url);
  const authError = parsed.searchParams.get('error');
  if (authError) throw new Error(`Google sign-in failed: ${authError}`);

  const token = parsed.searchParams.get('token');
  const refreshToken = parsed.searchParams.get('refreshToken');
  const needsUsername = parsed.searchParams.get('needsUsername') === 'true';

  if (!token || !refreshToken) throw new Error('Missing tokens in response');

  const currentUser = await getCurrentUser(token);
  setSession({ accessToken: token, refreshToken, currentUser, needsUsername });
  router.replace('/home');
}
