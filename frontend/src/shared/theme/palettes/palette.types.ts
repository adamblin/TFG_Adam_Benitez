export type ColorPalette = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  placeholderText: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  shadow: string;
  task: string;
  subtask: string;
  focusSession: string;
  riskLow: string;
};

export function createPalette(opts: {
  primary: string;
  secondary?: string;
  background: string;
  surface: string;
  border: string;
  text?: string;
  textMuted?: string;
  placeholderText?: string;
  task?: string;
  subtask?: string;
  focusSession?: string;
  riskLow?: string;
}): ColorPalette {
  return {
    primary: opts.primary,
    secondary: opts.secondary ?? opts.primary,
    background: opts.background,
    surface: opts.surface,
    surfaceMuted: '#f3f3f3',
    text: opts.text ?? '#FFFFFF',
    textMuted: opts.textMuted ?? '#A0A0A0',
    textSecondary: opts.textMuted ?? '#A0A0A0',
    placeholderText: opts.placeholderText ?? '#666666',
    border: opts.border,
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    shadow: '#000000',
    task:         opts.task         ?? '#4E8EF7',
    subtask:      opts.subtask      ?? '#9B72F8',
    focusSession: opts.focusSession ?? '#FF9A3C',
    riskLow:      opts.riskLow      ?? '#34C759',
  };
}
