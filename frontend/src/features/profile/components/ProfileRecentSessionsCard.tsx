import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../shared/components';
import { useTheme, spacing } from '../../../shared/theme';

type ProfileRecentSessionsCardProps = {
  sessions: string[];
};

export function ProfileRecentSessionsCard({ sessions }: ProfileRecentSessionsCardProps) {
  const colors = useTheme();
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <Text style={{
        color: colors.primary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: spacing.sm,
      }}>
        RECENT SESSIONS
      </Text>
      {sessions.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm }}>
          <Ionicons name="timer-outline" size={32} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center' }}>
            No focus sessions yet.{'\n'}Start your first session!
          </Text>
        </View>
      ) : (
        sessions.map((session, i) => (
          <View key={`${session}-${i}`} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            borderTopWidth: i === 0 ? 1 : 0,
            borderBottomWidth: 1,
            borderTopColor: colors.border,
            borderBottomColor: colors.border,
            gap: spacing.sm,
          }}>
            <View style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: `${colors.focusSession}18`,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: `${colors.focusSession}35`,
            }}>
              <Ionicons name="timer" size={16} color={colors.focusSession} />
            </View>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500', flex: 1 }}>
              {session}
            </Text>
          </View>
        ))
      )}
    </Card>
  );
}
