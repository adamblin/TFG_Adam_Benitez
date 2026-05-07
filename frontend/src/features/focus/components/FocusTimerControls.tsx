import React from 'react';
import { View } from 'react-native';
import { Button } from '../../../shared/components';
import { styles } from './FocusTimerControls.styles';

type FocusTimerControlsProps = {
  isRunning: boolean;
  isStarted: boolean;
  secondsLeft: number;
  onStart: () => void;
  onPauseResume: () => void;
  onStop: () => void;
};

export function FocusTimerControls({
  isRunning,
  isStarted,
  secondsLeft,
  onStart,
  onPauseResume,
  onStop,
}: FocusTimerControlsProps) {
  return (
    <View style={styles.container}>
      <Button
        label="▶ Start focus session"
        variant="outline"
        onPress={onStart}
        disabled={isRunning}
      />
      <Button
        label={isRunning ? '⏸ Pause' : '▶ Resume'}
        variant="secondary"
        onPress={onPauseResume}
        disabled={!isStarted || secondsLeft === 0}
      />
      <Button
        label="■ Stop"
        variant="secondary"
        onPress={onStop}
        disabled={!isStarted}
      />
    </View>
  );
}
