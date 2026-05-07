import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './ProfileLogoutButton.styles';

type ProfileLogoutButtonProps = {
  onPress: () => void;
};

export function ProfileLogoutButton({ onPress }: ProfileLogoutButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>Sign out</Text>
    </TouchableOpacity>
  );
}
