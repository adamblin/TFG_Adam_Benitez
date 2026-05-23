import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { makeStyles } from './ProfileLogoutButton.styles';
import { useTheme } from '../../../shared/theme';

type ProfileLogoutButtonProps = {
  onPress: () => void;
};

export function ProfileLogoutButton({ onPress }: ProfileLogoutButtonProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.label}>Sign out</Text>
    </TouchableOpacity>
  );
}
