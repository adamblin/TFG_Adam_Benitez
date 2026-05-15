export type StreakEntity = {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
