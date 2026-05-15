import { UserPreferencesEntity } from '../entities/shop.entity';

export abstract class ShopRepository {
  abstract getOwnedItemIds(userId: string): Promise<string[]>;
  abstract getPreferences(userId: string): Promise<UserPreferencesEntity | null>;
  abstract addToInventory(userId: string, itemId: string): Promise<void>;
  abstract upsertPreferences(
    userId: string,
    update: Partial<{ iconColor: string; theme: string }>,
  ): Promise<UserPreferencesEntity>;
}
