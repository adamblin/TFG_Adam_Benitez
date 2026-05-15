import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useStreakCelebrationStore } from '../../store/streak-celebration.store';
import { useStreak } from '../../features/streaks/hooks/useStreak';
import { colors, spacing } from '../theme';

export function StreakCelebrationOverlay() {
  const { visible, dismiss } = useStreakCelebrationStore();
  const { data: streak } = useStreak();
  const count = streak?.currentStreak ?? 1;

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale       = useRef(new Animated.Value(0.4)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;
  const flameScale      = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!visible) return;

    backdropOpacity.setValue(0);
    cardScale.setValue(0.4);
    cardOpacity.setValue(0);
    flameScale.setValue(0.5);

    Animated.sequence([
      // fade backdrop
      Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      // bounce card in
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 70,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(flameScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(dismiss, 3500);
    return () => clearTimeout(timer);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={dismiss}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000000',
            opacity: Animated.multiply(backdropOpacity, 0.85),
          }}
        />

        <Animated.View
          style={{
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
            width: 280,
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: '#111827',
            borderRadius: 28,
            borderWidth: 1,
            borderColor: '#f59e0b33',
            padding: spacing.xl,
            alignItems: 'center',
            width: '100%',
          }}>
            {/* Flame */}
            <Animated.Text
              style={{
                fontSize: 72,
                transform: [{ scale: flameScale }],
                marginBottom: spacing.md,
              }}
            >
              🔥
            </Animated.Text>

            {/* Streak count */}
            <Text style={{
              color: '#f59e0b',
              fontSize: 80,
              fontWeight: '900',
              lineHeight: 84,
              letterSpacing: -2,
            }}>
              {count}
            </Text>

            <Text style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: '800',
              marginTop: spacing.xs,
            }}>
              {count === 1 ? 'Day streak!' : 'Day streak!'}
            </Text>

            <Text style={{
              color: colors.textMuted,
              fontSize: 14,
              marginTop: spacing.sm,
              textAlign: 'center',
            }}>
              {count === 1
                ? 'Great start — come back tomorrow!'
                : `${count} days in a row. Keep it up!`}
            </Text>

            {/* Tap to dismiss hint */}
            <Text style={{
              color: '#ffffff22',
              fontSize: 11,
              marginTop: spacing.xl,
            }}>
              tap to continue
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// Inline StyleSheet to avoid extra import
const StyleSheet = {
  absoluteFillObject: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
  },
};
