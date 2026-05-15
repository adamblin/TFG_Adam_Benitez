import { Injectable } from '@nestjs/common';
import { StreaksRepository } from '../domain/repositories/streaks.repository';
import { StreakEntity } from '../domain/entities/streak.entity';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, reference: Date): boolean {
  const prev = new Date(reference);
  prev.setDate(prev.getDate() - 1);
  return isSameDay(date, prev);
}

export type StreakResult = {
  streak: StreakEntity;
  isNewRecord: boolean;
};

@Injectable()
export class StreaksService {
  constructor(private readonly streaksRepository: StreaksRepository) {}

  async getStreak(userId: string): Promise<StreakEntity | null> {
    return this.streaksRepository.findByUserId(userId);
  }

  async recordActivity(userId: string): Promise<StreakResult> {
    const today = startOfDay(new Date());
    const existing = await this.streaksRepository.findByUserId(userId);

    if (!existing) {
      const streak = await this.streaksRepository.upsert(userId, {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      });
      return { streak, isNewRecord: true };
    }

    const lastActive = existing.lastActiveDate
      ? startOfDay(existing.lastActiveDate)
      : null;

    if (lastActive && isSameDay(lastActive, today)) {
      return { streak: existing, isNewRecord: false };
    }

    const isConsecutive = lastActive && isYesterday(lastActive, today);
    const newCurrent = isConsecutive ? existing.currentStreak + 1 : 1;
    const newLongest = Math.max(newCurrent, existing.longestStreak);
    const isNewRecord = newCurrent > existing.longestStreak;

    const streak = await this.streaksRepository.upsert(userId, {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastActiveDate: today,
    });

    return { streak, isNewRecord };
  }
}
