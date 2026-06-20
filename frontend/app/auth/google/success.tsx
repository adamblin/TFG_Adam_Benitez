import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/store/auth.store';
import { handleCallbackUrl } from '../../../src/features/auth/hooks/useGoogleAuth';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    handleCallbackUrl(url, setSession, router).catch(() => {
      router.replace('/');
    });
  }, [router, setSession]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
