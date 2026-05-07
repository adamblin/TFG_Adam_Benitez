import React from 'react';
import { Alert, View } from 'react-native';
import { PageShell } from '../../src/shared/components';
import {
  ProfileHeaderCard,
  ProfileStatsRow,
  ProfileAccountSummaryCard,
  ProfileRecentSessionsCard,
  ProfileLogoutButton,
} from '../../src/features/profile/components';
import { useProfileScreen } from '../../src/features/profile/hooks/useProfileScreen';
import { styles } from './styles';

export default function ProfileScreen() {
  const {
    currentUser,
    avatarLetter,
    stats,
    summaryRows,
    recentSessions,
    handleLogout,
  } = useProfileScreen();

  const username = currentUser?.username ?? 'guest_user';
  const userId = currentUser?.id ?? 'unknown-id';

  const handleLogoutPress = () => {
    Alert.alert('Sign out', 'Do you want to close your current session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <PageShell>
      <View style={styles.content}>
        <ProfileHeaderCard avatarLetter={avatarLetter} username={username} userId={userId} />
        <ProfileStatsRow stats={stats} />
        <ProfileAccountSummaryCard rows={summaryRows} />
        <ProfileRecentSessionsCard sessions={recentSessions} />
        <ProfileLogoutButton onPress={handleLogoutPress} />
      </View>
    </PageShell>
  );
}
