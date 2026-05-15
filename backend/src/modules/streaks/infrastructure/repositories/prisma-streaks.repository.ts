import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { StreakEntity } from '../../domain/entities/streak.entity';
import { StreaksRepository } from '../../domain/repositories/streaks.repository';

@Injectable()
export class PrismaStreaksRepository implements StreaksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<StreakEntity | null> {
    return this.prisma.streak.findUnique({ where: { userId } });
  }

  upsert(
    userId: string,
    input: { currentStreak: number; longestStreak: number; lastActiveDate: Date },
  ): Promise<StreakEntity> {
    return this.prisma.streak.upsert({
      where: { userId },
      update: {
        currentStreak: input.currentStreak,
        longestStreak: input.longestStreak,
        lastActiveDate: input.lastActiveDate,
      },
      create: {
        userId,
        currentStreak: input.currentStreak,
        longestStreak: input.longestStreak,
        lastActiveDate: input.lastActiveDate,
      },
    });
  }
}
