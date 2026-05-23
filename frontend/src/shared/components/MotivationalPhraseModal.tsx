import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { usePhraseModalStore } from '../../store/phrase-modal.store';
import { useTheme, spacing } from '../theme';

export function MotivationalPhraseModal() {
  const colors = useTheme();
  const { visible, text, emoji, hide } = usePhraseModalStore();

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale       = useRef(new Animated.Value(0.5)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;
  const emojiScale      = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!visible) return;

    backdropOpacity.setValue(0);
    cardScale.setValue(0.5);
    cardOpacity.setValue(0);
    emojiScale.setValue(0.3);

    Animated.sequence([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(cardScale, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
        Animated.spring(emojiScale, { toValue: 1, tension: 65, friction: 5, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(hide, 3500);
    return () => clearTimeout(timer);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={hide}
      statusBarTranslucent
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={hide}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#000000',
            opacity: Animated.multiply(backdropOpacity, 0.75),
          }}
        />

        <Animated.View
          style={{
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
            width: 300,
            alignItems: 'center',
          }}
        >
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: `${colors.primary}30`,
            padding: spacing.xl,
            alignItems: 'center',
            width: '100%',
            gap: spacing.md,
          }}>

            <Animated.Text
              style={{
                fontSize: 64,
                transform: [{ scale: emojiScale }],
              }}
            >
              {emoji}
            </Animated.Text>

            <Text style={{
              color: colors.text,
              fontSize: 17,
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              {text}
            </Text>

            <Text style={{
              color: `${colors.textMuted}55`,
              fontSize: 11,
              marginTop: spacing.xs,
            }}>
              tap to continue
            </Text>

          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
