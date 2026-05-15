import { StreakEntity } from '../entities/streak.entity';

export abstract class StreaksRepository {
  abstract findByUserId(userId: string): Promise<StreakEntity | null>;
  abstract upsert(
    userId: string,
    input: {
      currentStreak: number;
      longestStreak: number;
      lastActiveDate: Date;
    },
  ): Promise<StreakEntity>;
}
