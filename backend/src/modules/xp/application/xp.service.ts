import { Injectable } from '@nestjs/common';
import { UserXPRepository } from '../domain/repositories/user-xp.repository';

const XP_PER_LEVEL = 200;
const DAILY_COINS = 10;

export type LevelInfo = {
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  coins: number;
};

function computeLevel(totalXp: number): { level: number; xpInLevel: number; xpToNextLevel: number; progressPercent: number } {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpInLevel = totalXp % XP_PER_LEVEL;
  return {
    level,
    xpInLevel,
    xpToNextLevel: XP_PER_LEVEL,
    progressPercent: Math.round((xpInLevel / XP_PER_LEVEL) * 100),
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

@Injectable()
export class XPService {
  constructor(private readonly userXPRepository: UserXPRepository) {}

  async getLevelInfo(userId: string): Promise<LevelInfo> {
    const record = await this.userXPRepository.findByUserId(userId);
    const xp = record?.totalXp ?? 0;
    return { ...computeLevel(xp), totalXp: xp, coins: record?.coins ?? 0 };
  }

  async awardXP(userId: string, amount: number): Promise<LevelInfo> {
    const before = await this.userXPRepository.findByUserId(userId);
    const prevLevel = computeLevel(before?.totalXp ?? 0).level;

    const record = await this.userXPRepository.addXP(userId, amount);
    const levelData = computeLevel(record.totalXp);

    // Determine coins to award
    let coinsToAdd = 0;
    let claimDate: Date | undefined;

    // Daily bonus: first productive action of the day
    const today = new Date();
    const lastClaim = record.lastCoinClaimAt;
    if (!lastClaim || !isSameDay(lastClaim, today)) {
      coinsToAdd += DAILY_COINS;
      claimDate = today;
    }

    // Level-up bonus: new level number of coins
    if (levelData.level > prevLevel) {
      coinsToAdd += levelData.level;
    }

    let finalCoins = record.coins;
    if (coinsToAdd > 0) {
      const updated = await this.userXPRepository.addCoins(userId, coinsToAdd, claimDate);
      finalCoins = updated.coins;
    }

    return { ...levelData, totalXp: record.totalXp, coins: finalCoins };
  }

  async spendCoins(userId: string, amount: number): Promise<number> {
    const record = await this.userXPRepository.findByUserId(userId);
    const balance = record?.coins ?? 0;
    if (balance < amount) {
      throw new Error(`Insufficient coins: have ${balance}, need ${amount}`);
    }
    const updated = await this.userXPRepository.spendCoins(userId, amount);
    return updated.coins;
  }
}
