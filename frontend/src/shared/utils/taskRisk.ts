import { colors } from '../theme';

export type RiskLevel = 'high' | 'medium' | 'low';

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  high:   { label: 'High risk',   color: colors.error },
  medium: { label: 'Medium risk', color: '#F5A623' },
  low:    { label: 'Low risk',    color: colors.success },
};

export const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export interface RiskInput {
  completed?: boolean;
  dueDate?: string | null;
  subtasks: Array<{ completed: boolean }>;
}

export function computeRisk(task: RiskInput): RiskLevel {
  if (task.completed) return 'low';

  const subs            = task.subtasks ?? [];
  const totalSubs       = subs.length;
  const doneSubs        = subs.filter((s) => s.completed).length;
  const completionRatio = totalSubs > 0 ? doneSubs / totalSubs : 0;

  if (totalSubs > 0 && doneSubs === totalSubs) return 'low';

  let daysLeft: number | null = null;
  if (task.dueDate) {
    const due   = new Date(`${task.dueDate.slice(0, 10)}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysLeft = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  }

  let urgency: number;
  if (daysLeft === null)    urgency = 20;
  else if (daysLeft < 0)   urgency = 70;
  else if (daysLeft === 0) urgency = 65;
  else if (daysLeft === 1) urgency = 55;
  else if (daysLeft <= 3)  urgency = 40;
  else if (daysLeft <= 7)  urgency = 25;
  else if (daysLeft <= 14) urgency = 12;
  else                     urgency = 3;

  const pending = totalSubs > 0 ? totalSubs - doneSubs : 1;
  const workPts = Math.min(pending * 5, 30);
  const score   = Math.round((urgency + workPts) * (1 - completionRatio * 0.7));

  if (score >= 50) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
}
