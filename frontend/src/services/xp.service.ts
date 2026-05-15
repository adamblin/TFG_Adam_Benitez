import { apiRequest } from './api.client';

export type LevelInfo = {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  coins: number;
};

export function getUserXP(): Promise<LevelInfo> {
  return apiRequest<LevelInfo>('/xp/me');
}
