import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ShopRepository } from '../../domain/repositories/shop.repository';
import { UserPreferencesEntity } from '../../domain/entities/shop.entity';

@Injectable()
export class PrismaShopRepository implements ShopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOwnedItemIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.userInventory.findMany({
      where: { userId },
      select: { itemId: true },
    });
    return rows.map((r) => r.itemId);
  }

  async getPreferences(userId: string): Promise<UserPreferencesEntity | null> {
    return this.prisma.userPreferences.findUnique({ where: { userId } });
  }

  async addToInventory(userId: string, itemId: string): Promise<void> {
    await this.prisma.userInventory.create({ data: { userId, itemId } });
  }

  async upsertPreferences(
    userId: string,
    update: Partial<{ iconColor: string; theme: string }>,
  ): Promise<UserPreferencesEntity> {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, iconColor: 'icon_blue', theme: 'theme_blue', ...update },
      update,
    });
  }
}
