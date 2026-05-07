import { useEffect, useMemo, useState } from 'react';

type UseFocusSessionOptions = {
  onSessionComplete?: () => void;
};

export function useFocusSession(options?: UseFocusSessionOptions) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          options?.onSessionComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, options]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [secondsLeft]);

  const progressPercent = useMemo(() => {
    if (!totalSeconds) {
      return 0;
    }

    return Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  }, [secondsLeft, totalSeconds]);

  const startSession = () => {
    const durationInSeconds = selectedDuration * 60;
    setTotalSeconds(durationInSeconds);
    setSecondsLeft(durationInSeconds);
    setIsStarted(true);
    setIsRunning(true);
  };

  const togglePauseResume = () => {
    if (!isStarted || secondsLeft === 0) {
      return;
    }

    setIsRunning((prev) => !prev);
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsStarted(false);
    setSecondsLeft(0);
    setTotalSeconds(0);
  };

  const selectDuration = (duration: number) => {
    if (isRunning) {
      return;
    }

    setSelectedDuration(duration);
  };

  return {
    selectedTaskId,
    setSelectedTaskId,
    selectedDuration,
    selectDuration,
    showTaskDropdown,
    setShowTaskDropdown,
    secondsLeft,
    isRunning,
    isStarted,
    formattedTime,
    progressPercent,
    startSession,
    togglePauseResume,
    stopSession,
  };
}
