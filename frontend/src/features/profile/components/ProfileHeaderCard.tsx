import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { styles } from './ProfileHeaderCard.styles';

type ProfileHeaderCardProps = {
  avatarLetter: string;
  username: string;
  userId: string;
};

export function ProfileHeaderCard({ avatarLetter, username, userId }: ProfileHeaderCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>{avatarLetter}</Text>
      </View>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.subtitle}>Authenticated user profile</Text>
      <Text style={styles.userId}>ID {userId}</Text>
    </Card>
  );
}
