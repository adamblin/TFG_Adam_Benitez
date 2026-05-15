export type ShopItemType = 'icon' | 'theme';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_PRICE: Record<Rarity, number> = {
  common:    0,
  uncommon:  20,
  rare:      50,
  epic:      100,
  legendary: 200,
};

export type CatalogItem = {
  id: string;
  type: ShopItemType;
  name: string;
  color: string;
  rarity: Rarity;
  price: number;
};

type RawEntry = { id: string; type: ShopItemType; name: string; color: string; rarity: Rarity };

function build(entries: RawEntry[]): CatalogItem[] {
  return entries.map((e) => ({ ...e, price: RARITY_PRICE[e.rarity] }));
}

export const SHOP_CATALOG: CatalogItem[] = build([
  // ── AVATAR ICON COLORS ──────────────────────────────────────────────────
  // Common
  { id: 'icon_blue',     type: 'icon', name: 'Blue',     color: '#007AFF', rarity: 'common'    },
  { id: 'icon_gray',     type: 'icon', name: 'Gray',     color: '#8E8E93', rarity: 'common'    },
  { id: 'icon_slate',    type: 'icon', name: 'Slate',    color: '#64748B', rarity: 'common'    },
  { id: 'icon_stone',    type: 'icon', name: 'Stone',    color: '#78716C', rarity: 'common'    },
  // Uncommon
  { id: 'icon_red',      type: 'icon', name: 'Red',      color: '#FF3B30', rarity: 'uncommon'  },
  { id: 'icon_green',    type: 'icon', name: 'Green',    color: '#34C759', rarity: 'uncommon'  },
  { id: 'icon_orange',   type: 'icon', name: 'Orange',   color: '#FF9500', rarity: 'uncommon'  },
  { id: 'icon_yellow',   type: 'icon', name: 'Yellow',   color: '#FFCC00', rarity: 'uncommon'  },
  { id: 'icon_cyan',     type: 'icon', name: 'Cyan',     color: '#32ADE6', rarity: 'uncommon'  },
  { id: 'icon_navy',     type: 'icon', name: 'Navy',     color: '#1D3461', rarity: 'uncommon'  },
  { id: 'icon_brown',    type: 'icon', name: 'Brown',    color: '#A0522D', rarity: 'uncommon'  },
  // Rare
  { id: 'icon_purple',   type: 'icon', name: 'Purple',   color: '#5856D6', rarity: 'rare'      },
  { id: 'icon_pink',     type: 'icon', name: 'Pink',     color: '#FF2D55', rarity: 'rare'      },
  { id: 'icon_teal',     type: 'icon', name: 'Teal',     color: '#30B0C7', rarity: 'rare'      },
  { id: 'icon_indigo',   type: 'icon', name: 'Indigo',   color: '#3F3FBF', rarity: 'rare'      },
  { id: 'icon_lime',     type: 'icon', name: 'Lime',     color: '#30D158', rarity: 'rare'      },
  { id: 'icon_coral',    type: 'icon', name: 'Coral',    color: '#FF6B6B', rarity: 'rare'      },
  { id: 'icon_rose',     type: 'icon', name: 'Rose',     color: '#E91E63', rarity: 'rare'      },
  { id: 'icon_sky',      type: 'icon', name: 'Sky',      color: '#0EA5E9', rarity: 'rare'      },
  // Epic
  { id: 'icon_gold',     type: 'icon', name: 'Gold',     color: '#C8960C', rarity: 'epic'      },
  { id: 'icon_crimson',  type: 'icon', name: 'Crimson',  color: '#C8002A', rarity: 'epic'      },
  { id: 'icon_violet',   type: 'icon', name: 'Violet',   color: '#BF5AF2', rarity: 'epic'      },
  { id: 'icon_emerald',  type: 'icon', name: 'Emerald',  color: '#00B894', rarity: 'epic'      },
  { id: 'icon_azure',    type: 'icon', name: 'Azure',    color: '#0080FF', rarity: 'epic'      },
  { id: 'icon_midnight', type: 'icon', name: 'Midnight', color: '#1A1A4E', rarity: 'epic'      },
  { id: 'icon_ruby',     type: 'icon', name: 'Ruby',     color: '#E0115F', rarity: 'epic'      },
  // Legendary
  { id: 'icon_solar',    type: 'icon', name: 'Solar',    color: '#FF6D00', rarity: 'legendary' },
  { id: 'icon_cosmic',   type: 'icon', name: 'Cosmic',   color: '#7B2FBE', rarity: 'legendary' },
  { id: 'icon_platinum', type: 'icon', name: 'Platinum', color: '#96A8B2', rarity: 'legendary' },
  { id: 'icon_neon',     type: 'icon', name: 'Neon',     color: '#0FFF50', rarity: 'legendary' },
  { id: 'icon_aurora',   type: 'icon', name: 'Aurora',   color: '#00FFAB', rarity: 'legendary' },
  { id: 'icon_obsidian', type: 'icon', name: 'Obsidian', color: '#3D0066', rarity: 'legendary' },

  // ── APP THEMES ──────────────────────────────────────────────────────────
  // Common
  { id: 'theme_blue',    type: 'theme', name: 'Ocean',   color: '#007AFF', rarity: 'common'    },
  { id: 'theme_dark',    type: 'theme', name: 'Dark',    color: '#374151', rarity: 'common'    },
  { id: 'theme_mono',    type: 'theme', name: 'Mono',    color: '#6B7280', rarity: 'common'    },
  // Uncommon
  { id: 'theme_green',   type: 'theme', name: 'Forest',  color: '#34C759', rarity: 'uncommon'  },
  { id: 'theme_orange',  type: 'theme', name: 'Sunset',  color: '#FF9500', rarity: 'uncommon'  },
  { id: 'theme_sand',    type: 'theme', name: 'Sand',    color: '#D4A853', rarity: 'uncommon'  },
  { id: 'theme_warm',    type: 'theme', name: 'Warm',    color: '#D97706', rarity: 'uncommon'  },
  // Rare
  { id: 'theme_purple',  type: 'theme', name: 'Cosmic',  color: '#5856D6', rarity: 'rare'      },
  { id: 'theme_rose',    type: 'theme', name: 'Rose',    color: '#FF2D55', rarity: 'rare'      },
  { id: 'theme_teal',    type: 'theme', name: 'Teal',    color: '#5AC8FA', rarity: 'rare'      },
  { id: 'theme_amber',   type: 'theme', name: 'Amber',   color: '#FF9F0A', rarity: 'rare'      },
  { id: 'theme_mint',    type: 'theme', name: 'Mint',    color: '#00C7BE', rarity: 'rare'      },
  // Epic
  { id: 'theme_neon',    type: 'theme', name: 'Neon',    color: '#39FF14', rarity: 'epic'      },
  { id: 'theme_crimson', type: 'theme', name: 'Crimson', color: '#C8002A', rarity: 'epic'      },
  { id: 'theme_arctic',  type: 'theme', name: 'Arctic',  color: '#00C2CB', rarity: 'epic'      },
  { id: 'theme_violet',  type: 'theme', name: 'Violet',  color: '#BF5AF2', rarity: 'epic'      },
  // Legendary
  { id: 'theme_gold',    type: 'theme', name: 'Gold',    color: '#FFD700', rarity: 'legendary' },
  { id: 'theme_inferno', type: 'theme', name: 'Inferno', color: '#FF4500', rarity: 'legendary' },
  { id: 'theme_void',    type: 'theme', name: 'Void',    color: '#0D1B2A', rarity: 'legendary' },
  { id: 'theme_cosmic',  type: 'theme', name: 'Galaxy',  color: '#7B2FBE', rarity: 'legendary' },
]);

export function findCatalogItem(id: string): CatalogItem | undefined {
  return SHOP_CATALOG.find((item) => item.id === id);
}
