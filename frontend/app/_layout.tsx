import { Stack } from 'expo-router';
import { colors } from '../src/shared/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StreakCelebrationOverlay } from '../src/shared/components';

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
				}}
			/>
			<StreakCelebrationOverlay />
		</QueryClientProvider>
	);
}
