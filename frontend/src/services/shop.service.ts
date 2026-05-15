import { apiRequest } from './api.client';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ShopItem = {
  id: string;
  type: 'icon' | 'theme';
  name: string;
  color: string;
  rarity: Rarity;
  price: number;
  owned: boolean;
  equipped: boolean;
};

export type Preferences = {
  iconColor: string;
  theme: string;
};

export function getShopCatalog(): Promise<ShopItem[]> {
  return apiRequest<ShopItem[]>('/shop/catalog');
}

export function getPreferences(): Promise<Preferences> {
  return apiRequest<Preferences>('/shop/preferences');
}

export function purchaseItem(itemId: string): Promise<{ coins: number }> {
  return apiRequest<{ coins: number }>('/shop/purchase', {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  });
}

export function equipItem(itemId: string): Promise<Preferences> {
  return apiRequest<Preferences>('/shop/equip', {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  });
}
