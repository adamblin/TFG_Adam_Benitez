import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { styles } from './ProfileHeaderCard.styles';
import { useThemeStore } from '../../../store/theme.store';

type ProfileHeaderCardProps = {
  avatarLetter: string;
  username: string;
  userId: string;
  coins?: number;
};

export function ProfileHeaderCard({ avatarLetter, username, userId, coins = 0 }: ProfileHeaderCardProps) {
  const iconColor = useThemeStore((s) => s.iconColor);

  return (
    <Card style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: iconColor }]}>
        <Text style={styles.avatarLetter}>{avatarLetter}</Text>
      </View>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.subtitle}>Authenticated user profile</Text>
      <Text style={styles.userId}>ID {userId}</Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        backgroundColor: '#2a1f00',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#c8960055',
      }}>
        <Text style={{ fontSize: 16 }}>💰</Text>
        <Text style={{ color: '#f0c040', fontSize: 15, fontWeight: '800' }}>
          {coins}
        </Text>
      </View>
    </Card>
  );
}
