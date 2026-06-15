import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CoinIcon } from '../../../shared/components';
import { makeStyles } from './ProfileHeaderCard.styles';
import { useTheme, spacing } from '../../../shared/theme';
import { useThemeStore } from '../../../store/theme.store';


type ProfileHeaderCardProps = {
  avatarLetter: string;
  username: string;
  userId: string;
  coins?: number;
};

export function ProfileHeaderCard({ avatarLetter, username, userId, coins = 0 }: ProfileHeaderCardProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  const iconColor = useThemeStore((s) => s.iconColor);

  return (
    <Card style={[styles.card, { overflow: 'hidden' }]}>
      {/* Diagonal gradient shimmer */}
      <LinearGradient
        colors={[`${colors.primary}28`, `${colors.secondary}14`, 'transparent']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />

      {/* Avatar with glow ring */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: iconColor,
            borderColor: `${iconColor}80`,
            borderWidth: 2,
            shadowColor: iconColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 16,
            elevation: 12,
          },
        ]}
      >
        <Text style={styles.avatarLetter}>{avatarLetter}</Text>
      </View>

      <Text style={styles.username}>{username}</Text>
      <Text style={styles.userId}>#{userId.slice(0, 8).toUpperCase()}</Text>

      {/* Coins badge */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.sm,
        backgroundColor: `${colors.warning}15`,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: `${colors.warning}35`,
      }}>
        <CoinIcon size={15} color={colors.warning} />
        <Text style={{ color: colors.warning, fontSize: 15, fontWeight: '800' }}>
          {coins.toLocaleString()}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '500' }}>coins</Text>
      </View>
    </Card>
  );
}
