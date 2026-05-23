import React, { useEffect, useRef } from 'react';
import {
  Alert, Animated, Modal, Pressable, Text, View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, spacing } from '../../../shared/theme';

type Props = {
  visible: boolean;
  formattedTime: string;
  statusText: string;
  progressPercent: number;
  isRunning: boolean;
  onPauseResume: () => void;
  onStop: () => void;
};

const RING_SIZE   = 260;
const STROKE_W    = 8;
const RADIUS      = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  return (
    <Svg
      width={RING_SIZE}
      height={RING_SIZE}
      style={{ transform: [{ rotate: '-90deg' }], position: 'absolute' }}
    >
      {/* Track */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={`${color}18`}
        strokeWidth={STROKE_W}
        fill="none"
      />
      {/* Progress */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={color}
        strokeWidth={STROKE_W}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function FocusActiveScreen({
  visible, formattedTime, statusText, progressPercent,
  isRunning, onPauseResume, onStop,
}: Props) {
  const colors = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStop = () => {
    Alert.alert(
      'Abandon session?',
      'You will not receive XP or coins if you stop now.',
      [
        { text: 'Keep focusing', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: onStop },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleStop}
    >
      <Animated.View style={{
        flex: 1,
        backgroundColor: colors.background,
        opacity: fadeAnim,
      }}>

        {/* Header */}
        <View style={{
          paddingTop: 60,
          paddingHorizontal: spacing.xl,
          alignItems: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: `${colors.focusSession}18`,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: `${colors.focusSession}35`,
          }}>
            <View style={{
              width: 7, height: 7, borderRadius: 4,
              backgroundColor: isRunning ? colors.focusSession : colors.textMuted,
            }} />
            <Text style={{
              color: isRunning ? colors.focusSession : colors.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.5,
            }}>
              {isRunning ? 'FOCUSING' : 'PAUSED'}
            </Text>
          </View>

          <Text style={{
            color: colors.textMuted,
            fontSize: 14,
            marginTop: spacing.sm,
            textAlign: 'center',
          }}>
            {statusText}
          </Text>
        </View>

        {/* Timer ring — centered */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing percent={progressPercent} color={colors.focusSession} />
            <Text style={{
              color: colors.text,
              fontSize: 62,
              fontWeight: '900',
              fontVariant: ['tabular-nums'],
              letterSpacing: 2,
            }}>
              {formattedTime}
            </Text>
            <Text style={{
              color: colors.textMuted,
              fontSize: 12,
              marginTop: 4,
              fontWeight: '500',
            }}>
              remaining
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={{
          paddingHorizontal: spacing.xl,
          paddingBottom: 56,
          gap: spacing.md,
        }}>
          <Pressable
            onPress={onPauseResume}
            style={({ pressed }) => ({
              backgroundColor: pressed ? `${colors.focusSession}cc` : colors.focusSession,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
            })}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>
              {isRunning ? 'Pause' : 'Resume'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onStop}
            style={({ pressed }) => ({
              backgroundColor: pressed ? `${colors.border}` : 'transparent',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: colors.border,
            })}
          >
            <Text style={{ color: colors.textMuted, fontSize: 17, fontWeight: '700' }}>
              Stop session
            </Text>
          </Pressable>
        </View>

      </Animated.View>
    </Modal>
  );
}
