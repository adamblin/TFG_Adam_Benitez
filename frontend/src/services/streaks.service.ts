import { apiRequest } from './api.client';

export type Streak = {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export function getStreak(): Promise<Streak> {
  return apiRequest<Streak>('/streaks');
}
