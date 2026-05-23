import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing } from '../theme';

interface ActionCardProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
}

export function ActionCard({ title, subtitle, onPress, icon, accentColor }: ActionCardProps) {
  const colors = useTheme();
  const accent = accentColor ?? colors.primary;
  return (
    <TouchableOpacity
      style={{
        width: '48.8%',
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${accent}40`,
        borderTopColor: `${accent}80`,
        padding: spacing.md,
        minHeight: 116,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Subtle top sheen matching accent */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        backgroundColor: `${accent}0c`,
      }} pointerEvents="none" />

      <View style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: `${accent}20`,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: `${accent}35`,
        marginBottom: spacing.xs,
      }}>
        {icon && <Ionicons name={icon} size={20} color={accent} />}
      </View>

      <View>
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800', marginBottom: 2 }}>
          {title}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}
