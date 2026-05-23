import { Stack, router, usePathname, useRootNavigationState } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { StreakCelebrationOverlay, MotivationalPhraseModal } from '../src/shared/components';
import { useTheme } from '../src/shared/theme';
import { usePreferences } from '../src/features/shop/hooks/useShop';
import { useAuthStore } from '../src/store/auth.store';

const queryClient = new QueryClient();

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];

function AuthGuard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const pathname = usePathname();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!accessToken && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/');
    }
  }, [accessToken, pathname, navigationState?.key]);

  return null;
}

function ThemedStack() {
  const colors = useTheme();
  usePreferences();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemedStack />
      <AuthGuard />
      <StreakCelebrationOverlay />
      <MotivationalPhraseModal />
    </QueryClientProvider>
  );
}
