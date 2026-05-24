import { useMemo, useState } from 'react';
import { useTasks } from '../../tasks/hooks/useTasks';
import { computeRisk, makeRiskConfig, RISK_ORDER, type RiskLevel } from '../../../shared/utils/taskRisk';
import type { Task } from '../../../services/tasks.service';
import { useTheme } from '../../../shared/theme';

export type StressLevel = 'low' | 'moderate' | 'high';

export type StuckTask = Task & { risk: RiskLevel };

export type StressInfo = {
  level: StressLevel;
  percent: number;
  label: string;
  emoji: string;
};

/**
 * Calcula el nivel de estrés ponderando tareas pendientes: alto riesgo vale 3 puntos, medio 1.
 * El porcentaje se normaliza sobre el máximo posible (todas las tareas en riesgo alto).
 */
function computeStress(tasks: Task[]): StressInfo {
  const pending     = tasks.filter((t) => !t.completed);
  const highCount   = pending.filter((t) => computeRisk(t) === 'high').length;
  const mediumCount = pending.filter((t) => computeRisk(t) === 'medium').length;
  const score    = highCount * 3 + mediumCount;
  const maxScore = Math.max(pending.length * 3, 1);
  const percent  = Math.min(Math.round((score / maxScore) * 100), 100);

  if (percent >= 50) return { level: 'high',     percent, label: 'High stress',     emoji: '🔥' };
  if (percent >= 20) return { level: 'moderate',  percent, label: 'Moderate stress', emoji: '⚡' };
  return               { level: 'low',      percent, label: 'Low stress',      emoji: '🌿' };
}

export function formatDueDateCa(dueDate: string | null): string {
  if (!dueDate) return '';
  const due   = new Date(`${dueDate.slice(0, 10)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0)   return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 6) {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return DAYS[due.getDay()];
  }
  return `${due.getDate()}/${due.getMonth() + 1}`;
}

const ESSENTIAL_LIMIT = 3;

/** Provee datos para la pantalla "Safe Mode": nivel de estrés, tareas ordenadas por riesgo y las 3 más urgentes. */
export function useStuckScreen() {
  const colors = useTheme();
  const { data: tasks = [], isLoading } = useTasks();
  const [showAll, setShowAll] = useState(false);

  const pending = tasks.filter((t) => !t.completed);

  // All pending tasks sorted by risk (high → medium → low)
  const tasksWithRisk: StuckTask[] = useMemo(
    () =>
      pending
        .map((t) => ({ ...t, risk: computeRisk(t) }))
        .sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks],
  );

  // "Estic saturat" → only the top 3 most urgent tasks
  const essentialTasks = tasksWithRisk.slice(0, ESSENTIAL_LIMIT);
  const visibleTasks   = showAll ? tasksWithRisk : essentialTasks;

  const stress         = useMemo(() => computeStress(tasks), [tasks]);
  const riskConfig     = makeRiskConfig(colors);

  const stressBarColor =
    stress.level === 'high'     ? colors.error :
    stress.level === 'moderate' ? '#FBBF24'    :
    colors.riskLow;

  return {
    isLoading,
    stress,
    stressBarColor,
    riskConfig,
    showAll,
    setShowAll,
    visibleTasks,
    totalPending: pending.length,
  };
}
