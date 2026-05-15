import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { startFocusSession, endFocusSession } from '../../../services/focus.service';
import { useStreakCelebrationStore } from '../../../store/streak-celebration.store';

type UseFocusSessionOptions = {
  initialTaskId?: string | null;
};

export function useFocusSession(options?: UseFocusSessionOptions) {
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(options?.initialTaskId ?? null);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needCompletion, setNeedCompletion] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setNeedCompletion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (!needCompletion) return;
    setNeedCompletion(false);

    const sid = sessionIdRef.current;
    if (!sid) return;

    endFocusSession({ sessionId: sid, completed: true })
      .then(({ message }) => {
        sessionIdRef.current = null;
        queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
        queryClient.invalidateQueries({ queryKey: ['streak'] });
        queryClient.invalidateQueries({ queryKey: ['user-xp'] });
        useStreakCelebrationStore.getState().show();
        Alert.alert('Session complete', message);
      })
      .catch(() => {
        sessionIdRef.current = null;
        Alert.alert('Session complete', 'Great work! Your session has been recorded.');
      });
  }, [needCompletion, queryClient]);

  const formattedTime = useMemo(() => {
    const displaySeconds = isStarted ? secondsLeft : selectedDuration * 60;
    const minutes = Math.floor(displaySeconds / 60);
    const seconds = displaySeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [secondsLeft, selectedDuration, isStarted]);

  const progressPercent = useMemo(() => {
    if (!isStarted || !totalSeconds) return 0;
    return Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  }, [secondsLeft, totalSeconds, isStarted]);

  const startSession = async () => {
    if (isLoading || isStarted) return;
    setIsLoading(true);
    try {
      const session = await startFocusSession({
        durationMin: selectedDuration,
        taskId: selectedTaskId,
      });
      sessionIdRef.current = session.id;
      const durationInSeconds = selectedDuration * 60;
      setTotalSeconds(durationInSeconds);
      setSecondsLeft(durationInSeconds);
      setIsStarted(true);
      setIsRunning(true);
    } catch {
      Alert.alert('Error', 'Could not start the focus session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePauseResume = () => {
    if (!isStarted || secondsLeft === 0) return;
    setIsRunning((prev) => !prev);
  };

  const stopSession = async () => {
    const sid = sessionIdRef.current;
    sessionIdRef.current = null;
    setIsRunning(false);
    setIsStarted(false);
    setSecondsLeft(0);
    setTotalSeconds(0);

    if (sid) {
      try {
        await endFocusSession({ sessionId: sid, completed: false });
        queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
      } catch {
        // session remains as incomplete in backend — acceptable
      }
    }
  };

  const selectDuration = (duration: number) => {
    if (isStarted) return;
    setSelectedDuration(duration);
  };

  return {
    selectedTaskId,
    setSelectedTaskId,
    selectedDuration,
    selectDuration,
    secondsLeft,
    isRunning,
    isStarted,
    isLoading,
    formattedTime,
    progressPercent,
    startSession,
    togglePauseResume,
    stopSession,
  };
}
