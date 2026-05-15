import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { XPService } from 'src/modules/xp/application/xp.service';
import { ShopRepository } from '../domain/repositories/shop.repository';
import { SHOP_CATALOG, findCatalogItem } from './shop.catalog';

export type CatalogItemDto = {
  id: string;
  type: 'icon' | 'theme';
  name: string;
  color: string;
  rarity: string;
  price: number;
  owned: boolean;
  equipped: boolean;
};

export type PreferencesDto = {
  iconColor: string;
  theme: string;
};

@Injectable()
export class ShopService {
  constructor(
    private readonly shopRepository: ShopRepository,
    private readonly xpService: XPService,
  ) {}

  async getCatalog(userId: string): Promise<CatalogItemDto[]> {
    const [ownedIds, prefs] = await Promise.all([
      this.shopRepository.getOwnedItemIds(userId),
      this.shopRepository.getPreferences(userId),
    ]);

    const ownedSet = new Set(ownedIds);
    const equippedIcon = prefs?.iconColor ?? 'icon_blue';
    const equippedTheme = prefs?.theme ?? 'theme_blue';

    return SHOP_CATALOG.map((item) => ({
      ...item,
      owned: item.price === 0 || ownedSet.has(item.id),
      equipped: item.type === 'icon' ? item.id === equippedIcon : item.id === equippedTheme,
    }));
  }

  async getPreferences(userId: string): Promise<PreferencesDto> {
    const prefs = await this.shopRepository.getPreferences(userId);
    return {
      iconColor: prefs?.iconColor ?? 'icon_blue',
      theme: prefs?.theme ?? 'theme_blue',
    };
  }

  async purchase(userId: string, itemId: string): Promise<{ coins: number }> {
    const item = findCatalogItem(itemId);
    if (!item) throw new NotFoundException(`Item not found: ${itemId}`);
    if (item.price === 0) throw new BadRequestException('This item is free — no purchase needed');

    const ownedIds = await this.shopRepository.getOwnedItemIds(userId);
    if (ownedIds.includes(itemId)) throw new BadRequestException('Item already owned');

    const remainingCoins = await this.xpService.spendCoins(userId, item.price);
    await this.shopRepository.addToInventory(userId, itemId);

    return { coins: remainingCoins };
  }

  async equip(userId: string, itemId: string): Promise<PreferencesDto> {
    const item = findCatalogItem(itemId);
    if (!item) throw new NotFoundException(`Item not found: ${itemId}`);

    // Check ownership (free items are always owned)
    if (item.price > 0) {
      const ownedIds = await this.shopRepository.getOwnedItemIds(userId);
      if (!ownedIds.includes(itemId)) {
        throw new BadRequestException('Item not owned — purchase it first');
      }
    }

    const update = item.type === 'icon' ? { iconColor: itemId } : { theme: itemId };
    const prefs = await this.shopRepository.upsertPreferences(userId, update);
    return { iconColor: prefs.iconColor, theme: prefs.theme };
  }
}
