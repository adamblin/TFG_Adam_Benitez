import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserXPEntity } from '../../domain/entities/user-xp.entity';
import { UserXPRepository } from '../../domain/repositories/user-xp.repository';

@Injectable()
export class PrismaUserXPRepository implements UserXPRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<UserXPEntity | null> {
    return this.prisma.userXP.findUnique({ where: { userId } });
  }

  async addXP(userId: string, amount: number): Promise<UserXPEntity> {
    return this.prisma.userXP.upsert({
      where: { userId },
      create: { userId, totalXp: amount, coins: 0 },
      update: { totalXp: { increment: amount } },
    });
  }

  async addCoins(userId: string, amount: number, claimDate?: Date): Promise<UserXPEntity> {
    return this.prisma.userXP.upsert({
      where: { userId },
      create: { userId, totalXp: 0, coins: amount, lastCoinClaimAt: claimDate ?? null },
      update: {
        coins: { increment: amount },
        ...(claimDate ? { lastCoinClaimAt: claimDate } : {}),
      },
    });
  }

  async spendCoins(userId: string, amount: number): Promise<UserXPEntity> {
    return this.prisma.userXP.update({
      where: { userId },
      data: { coins: { decrement: amount } },
    });
  }
}
