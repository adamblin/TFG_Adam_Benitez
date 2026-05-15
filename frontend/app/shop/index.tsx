import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, Alert,
  useWindowDimensions, Modal, Pressable,
} from 'react-native';
import { PageShell, SectionLabel } from '../../src/shared/components';
import { colors, spacing } from '../../src/shared/theme';
import {
  useShopCatalog, usePreferences, usePurchaseItem, useEquipItem,
} from '../../src/features/shop/hooks/useShop';
import { useUserXP } from '../../src/features/xp/hooks/useUserXP';
import type { Rarity, ShopItem } from '../../src/services/shop.service';

const RARITY_COLOR: Record<Rarity, string> = {
  common:    '#9E9E9E',
  uncommon:  '#4CAF50',
  rare:      '#2196F3',
  epic:      '#9C27B0',
  legendary: '#FFB300',
};

const RARITY_LABEL: Record<Rarity, string> = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
};

const ICON_COLS = 8;
const THEME_COLS = 5;
const PAGE_PADDING = spacing.lg * 2;
const TILE_GAP = 5;

// ── Single icon tile (very small, color-swatch style) ────────────────────
function IconTile({ item, size, onPress }: { item: ShopItem; size: number; onPress: () => void }) {
  const rc = RARITY_COLOR[item.rarity];
  const borderW = item.rarity === 'legendary' ? 2.5 : 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      style={{ width: size, height: size, padding: 2, marginBottom: TILE_GAP }}>
      <View style={{
        flex: 1,
        borderRadius: 10,
        backgroundColor: item.color,
        borderWidth: item.equipped ? borderW + 1 : borderW,
        borderColor: item.equipped ? '#ffffff' : rc,
        overflow: 'hidden',
        shadowColor: item.equipped ? '#fff' : rc,
        shadowOpacity: item.equipped ? 0.9 : (item.rarity === 'legendary' ? 0.6 : 0.3),
        shadowRadius: item.equipped ? 6 : 3,
        elevation: item.equipped ? 8 : 2,
      }}>
        {/* Lock overlay */}
        {!item.owned && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: size * 0.28, lineHeight: size * 0.32 }}>🔒</Text>
          </View>
        )}
        {/* Equipped checkmark */}
        {item.equipped && (
          <View style={{
            position: 'absolute', bottom: 2, right: 2,
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: 6, width: size * 0.28, height: size * 0.28,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: size * 0.18, fontWeight: '900' }}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Theme tile (wider, shows name + rarity strip) ────────────────────────
function ThemeTile({ item, size, onPress }: { item: ShopItem; size: number; onPress: () => void }) {
  const rc = RARITY_COLOR[item.rarity];
  const borderW = item.rarity === 'legendary' ? 2.5 : 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      style={{ width: size, marginBottom: TILE_GAP + 2, alignItems: 'center' }}>
      <View style={{
        width: size - 4,
        height: size - 4,
        borderRadius: 12,
        backgroundColor: item.color,
        borderWidth: item.equipped ? borderW + 1 : borderW,
        borderColor: item.equipped ? '#ffffff' : rc,
        overflow: 'hidden',
        shadowColor: item.equipped ? '#fff' : rc,
        shadowOpacity: item.equipped ? 0.9 : (item.rarity === 'legendary' ? 0.7 : 0.35),
        shadowRadius: item.equipped ? 8 : 4,
        elevation: item.equipped ? 8 : 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Rarity strip at bottom */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 4, backgroundColor: rc,
        }} />
        {/* Lock overlay */}
        {!item.owned && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.52)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: (size - 4) * 0.25, lineHeight: (size - 4) * 0.3 }}>🔒</Text>
            <Text style={{ color: '#f0c040', fontSize: 10, fontWeight: '800', marginTop: 1 }}>
              {item.price}🪙
            </Text>
          </View>
        )}
        {item.equipped && (
          <View style={{
            position: 'absolute', top: 5, right: 5,
            backgroundColor: 'rgba(0,0,0,0.35)',
            borderRadius: 8, width: 18, height: 18,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>✓</Text>
          </View>
        )}
      </View>
      <Text style={{
        color: item.equipped ? colors.text : colors.textMuted,
        fontSize: 9,
        fontWeight: item.equipped ? '700' : '500',
        marginTop: 3,
        textAlign: 'center',
      }} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

// ── Detail bottom sheet shown on tap ────────────────────────────────────
function ItemDetailSheet({
  item, visible, onClose, onAction, isBuying,
}: {
  item: ShopItem | null;
  visible: boolean;
  onClose: () => void;
  onAction: () => void;
  isBuying: boolean;
}) {
  if (!item) return null;
  const rc = RARITY_COLOR[item.rarity];

  const actionLabel = item.equipped ? 'Already Equipped'
    : item.owned   ? 'Equip'
    : `Buy for ${item.price} 🪙`;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />
      <View style={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: spacing.xl,
        borderTopWidth: 3, borderTopColor: rc,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
          {/* Color preview */}
          <View style={{
            width: 64, height: 64, borderRadius: 14,
            backgroundColor: item.color,
            borderWidth: 3, borderColor: rc,
            shadowColor: rc, shadowOpacity: 0.7, shadowRadius: 10,
            elevation: 10,
          }} />
          <View style={{ flex: 1 }}>
            <Text style={{
              color: rc, fontSize: 10, fontWeight: '800',
              letterSpacing: 1, marginBottom: 2,
            }}>
              {RARITY_LABEL[item.rarity].toUpperCase()}
            </Text>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>{item.name}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
              {item.type === 'icon' ? 'Avatar Color' : 'App Theme'}
              {item.price > 0 && !item.owned ? ` • ${item.price} 🪙` : ''}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onAction}
          disabled={item.equipped || isBuying}
          style={{
            backgroundColor: item.equipped ? `${rc}22` : rc,
            borderRadius: 14,
            paddingVertical: spacing.md,
            alignItems: 'center',
            opacity: item.equipped ? 0.6 : 1,
          }}
        >
          <Text style={{
            color: item.equipped ? rc : '#fff',
            fontSize: 15,
            fontWeight: '900',
          }}>
            {isBuying ? 'Processing…' : actionLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────
export default function ShopScreen() {
  const { width } = useWindowDimensions();
  const iconTileSize = (width - PAGE_PADDING - TILE_GAP * (ICON_COLS - 1)) / ICON_COLS;
  const themeTileSize = (width - PAGE_PADDING - TILE_GAP * (THEME_COLS - 1)) / THEME_COLS;

  const { data: catalog = [], isLoading } = useShopCatalog();
  const { data: xp } = useUserXP();
  usePreferences();

  const purchaseMutation = usePurchaseItem();
  const equipMutation = useEquipItem();

  const [selected, setSelected] = useState<ShopItem | null>(null);

  const icons = catalog.filter((i) => i.type === 'icon');
  const themes = catalog.filter((i) => i.type === 'theme');

  const handleTileTap = (item: ShopItem) => setSelected(item);

  const handleAction = () => {
    if (!selected || selected.equipped) return;

    if (selected.owned || selected.price === 0) {
      equipMutation.mutate(selected.id, { onSuccess: () => setSelected(null) });
      return;
    }

    const balance = xp?.coins ?? 0;
    if (balance < selected.price) {
      Alert.alert('Not enough coins', `You need ${selected.price} 🪙 but only have ${balance}.`);
      return;
    }

    Alert.alert(
      `Buy ${selected.name}`,
      `Purchase for ${selected.price} 🪙?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () =>
            purchaseMutation.mutate(selected.id, { onSuccess: () => setSelected(null) }),
        },
      ],
    );
  };

  const isBusy = purchaseMutation.isPending || equipMutation.isPending;

  return (
    <PageShell>
      {/* Header */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: spacing.lg,
      }}>
        <View>
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>Shop</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            Tap an item to preview
          </Text>
        </View>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: '#2a1f00', borderRadius: 20,
          paddingHorizontal: 12, paddingVertical: 7,
          borderWidth: 1, borderColor: '#c8960055',
        }}>
          <Text style={{ fontSize: 15 }}>🪙</Text>
          <Text style={{ color: '#f0c040', fontSize: 15, fontWeight: '900' }}>
            {xp?.coins ?? 0}
          </Text>
        </View>
      </View>

      {/* Rarity legend */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
        {(Object.entries(RARITY_COLOR) as [Rarity, string][]).map(([r, c]) => (
          <View key={r} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
            <Text style={{ color: colors.textMuted, fontSize: 10 }}>{RARITY_LABEL[r]}</Text>
          </View>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <>
          <SectionLabel>AVATAR COLOR</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP, marginBottom: spacing.lg }}>
            {icons.map((item) => (
              <IconTile key={item.id} item={item} size={iconTileSize} onPress={() => handleTileTap(item)} />
            ))}
          </View>

          <SectionLabel>APP THEME</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP, marginBottom: spacing.lg }}>
            {themes.map((item) => (
              <ThemeTile key={item.id} item={item} size={themeTileSize} onPress={() => handleTileTap(item)} />
            ))}
          </View>
        </>
      )}

      <ItemDetailSheet
        item={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
        onAction={handleAction}
        isBuying={isBusy}
      />
    </PageShell>
  );
}
