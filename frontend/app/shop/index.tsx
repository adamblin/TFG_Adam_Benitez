import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  useWindowDimensions, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageShell } from '../../src/shared/components';
import { spacing, useTheme } from '../../src/shared/theme';
import {
  useShopCatalog, usePreferences, usePurchaseItem, useEquipItem,
} from '../../src/features/shop/hooks/useShop';
import { useUserXP } from '../../src/features/xp/hooks/useUserXP';
import type { ShopItem } from '../../src/services/shop.service';

// ─── Design tokens ────────────────────────────────────────────────────────────
const TILE_GAP    = 8;
const MIN_TILE_PX = 68;
const MIN_COLS    = 4;
const MAX_COLS    = 8;
const COIN_GOLD   = '#f0c040';

// ─── Theme palette previews ───────────────────────────────────────────────────
type ThemePal = { bg: string; sf: string; p1: string; p2: string };

const THEME_PREVIEW: Record<string, ThemePal> = {
  theme_blue:    { bg: '#090c10', sf: '#141a22', p1: '#007AFF', p2: '#E879F9' },
  theme_dark:    { bg: '#0c0c0c', sf: '#1a1a1a', p1: '#8E8E93', p2: '#38BDF8' },
  theme_mono:    { bg: '#0c0c0c', sf: '#1c1c1c', p1: '#9E9E9E', p2: '#2DD4BF' },
  theme_green:   { bg: '#080e09', sf: '#111e12', p1: '#34C759', p2: '#60A5FA' },
  theme_orange:  { bg: '#0e0c09', sf: '#1e1a12', p1: '#FF9500', p2: '#4ADE80' },
  theme_sand:    { bg: '#0d0c09', sf: '#1c1a12', p1: '#D4A853', p2: '#2DD4BF' },
  theme_warm:    { bg: '#0e0c09', sf: '#1e1a12', p1: '#D97706', p2: '#4ADE80' },
  theme_purple:  { bg: '#09090f', sf: '#141420', p1: '#5856D6', p2: '#34D399' },
  theme_rose:    { bg: '#0e090c', sf: '#1e1218', p1: '#FF2D55', p2: '#FBBF24' },
  theme_teal:    { bg: '#080c0f', sf: '#121a20', p1: '#5AC8FA', p2: '#A78BFA' },
  theme_amber:   { bg: '#0e0c09', sf: '#1e1a12', p1: '#FF9F0A', p2: '#34D399' },
  theme_mint:    { bg: '#080f0e', sf: '#111e1c', p1: '#00C7BE', p2: '#818CF8' },
  theme_neon:    { bg: '#080e08', sf: '#111e11', p1: '#39FF14', p2: '#FBBF24' },
  theme_crimson: { bg: '#0e090a', sf: '#1e1214', p1: '#C8002A', p2: '#4ADE80' },
  theme_arctic:  { bg: '#080c0e', sf: '#121c20', p1: '#00C2CB', p2: '#FBBF24' },
  theme_violet:  { bg: '#0c090f', sf: '#1a1420', p1: '#BF5AF2', p2: '#F472B6' },
  theme_gold:    { bg: '#0d0d09', sf: '#1c1c12', p1: '#FFD700', p2: '#F472B6' },
  theme_inferno: { bg: '#0e0b09', sf: '#1e1612', p1: '#FF4500', p2: '#A78BFA' },
  theme_void:    { bg: '#08090e', sf: '#12141e', p1: '#6E7EFF', p2: '#F472B6' },
  theme_cosmic:  { bg: '#09090f', sf: '#141420', p1: '#5856D6', p2: '#34D399' },
};

// ─── Icon avatar mini-preview ─────────────────────────────────────────────────
function IconPreview({ color, size }: { color: string; size: number }) {
  const circleD = Math.round(size * 0.58);
  const headD   = Math.round(circleD * 0.36);
  const bodyW   = Math.round(circleD * 0.52);
  const bodyH   = Math.round(circleD * 0.26);

  return (
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#0d1120',
      alignItems: 'center', justifyContent: 'center',
    }} pointerEvents="none">
      <View style={{
        width: circleD, height: circleD, borderRadius: circleD / 2,
        backgroundColor: color,
        alignItems: 'center', justifyContent: 'center',
        gap: Math.round(circleD * 0.06),
      }}>
        {/* Head */}
        <View style={{
          width: headD, height: headD, borderRadius: headD / 2,
          backgroundColor: 'rgba(255,255,255,0.88)',
        }} />
        {/* Body */}
        <View style={{
          width: bodyW, height: bodyH, borderRadius: bodyH / 2,
          backgroundColor: 'rgba(255,255,255,0.65)',
        }} />
      </View>
    </View>
  );
}

// ─── Theme palette mini-preview ───────────────────────────────────────────────
function ThemePreview({ pal, size }: { pal: ThemePal; size: number }) {
  const cardW   = Math.round(size * 0.78);
  const cardH   = Math.round(size * 0.42);
  const dotD    = Math.round(size * 0.14);
  const barH    = Math.round(size * 0.13);
  const gap     = Math.round(size * 0.09);
  const cRadius = Math.round(size * 0.09);

  return (
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: pal.bg,
      alignItems: 'center',
      justifyContent: 'center',
      gap,
    }} pointerEvents="none">
      <View style={{
        width: cardW, height: cardH,
        backgroundColor: pal.sf,
        borderRadius: cRadius,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: dotD * 0.7,
      }}>
        <View style={{ width: dotD, height: dotD, borderRadius: dotD / 2, backgroundColor: pal.p1 }} />
        <View style={{
          width: Math.round(dotD * 0.7), height: Math.round(dotD * 0.7),
          borderRadius: dotD / 2, backgroundColor: pal.p2, opacity: 0.8,
        }} />
      </View>
      <View style={{ width: cardW, height: barH, backgroundColor: pal.p1, borderRadius: barH / 2 }} />
    </View>
  );
}

// ─── Tile ─────────────────────────────────────────────────────────────────────
function ShopTile({ item, size, onPress }: { item: ShopItem; size: number; onPress: () => void }) {
  const colors  = useTheme();
  const bw      = 1.5;
  const radius  = Math.round(size * 0.22);
  const lockPx  = Math.round(size * 0.28);
  const pal     = THEME_PREVIEW[item.id];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ width: size }}>

      <View style={{
        width: size, height: size,
        borderRadius: radius,
        backgroundColor: item.type === 'theme' ? (pal?.bg ?? item.color) : '#0d1120',
        borderWidth: item.equipped ? bw + 1.5 : bw,
        borderColor: item.equipped ? '#ffffff' : 'transparent',
        overflow: 'hidden',
        shadowColor: '#ffffff',
        shadowOpacity: item.equipped ? 0.7 : 0,
        shadowRadius: item.equipped ? 6 : 0,
        elevation: item.equipped ? 5 : 0,
      }}>

        {/* Theme palette preview */}
        {item.type === 'theme' && pal && <ThemePreview pal={pal} size={size} />}

        {/* Icon avatar preview */}
        {item.type === 'icon' && <IconPreview color={item.color} size={size} />}


        {/* Equipped badge — top-right */}
        {item.equipped && (
          <View style={{
            position: 'absolute', top: 5, right: 5,
            width: Math.round(size * 0.38), height: Math.round(size * 0.38),
            borderRadius: Math.round(size * 0.19),
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: Math.round(size * 0.22), fontWeight: '900' }}>✓</Text>
          </View>
        )}

        {/* Unowned overlay */}
        {!item.owned && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.58)',
            alignItems: 'center', justifyContent: 'center', gap: 3,
          }}>
            <Text style={{ fontSize: lockPx, lineHeight: lockPx * 1.2 }}>🔒</Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 3,
              backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999,
              paddingHorizontal: Math.round(size * 0.1),
              paddingVertical: Math.round(size * 0.04),
              borderWidth: 1, borderColor: `${COIN_GOLD}55`,
            }}>
              <Ionicons name="logo-bitcoin" size={Math.round(size * 0.16)} color={COIN_GOLD} />
              <Text style={{ color: COIN_GOLD, fontSize: Math.round(size * 0.15), fontWeight: '900', lineHeight: Math.round(size * 0.2) }}>
                {item.price}
              </Text>
            </View>
          </View>
        )}

      </View>

      <Text numberOfLines={1} style={{
        color: item.equipped ? colors.text : colors.textMuted,
        fontSize: 11, fontWeight: item.equipped ? '700' : '500',
        marginTop: 5, textAlign: 'center',
      }}>
        {item.name}
      </Text>


    </TouchableOpacity>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionRow({ title, owned, total }: { title: string; owned: number; total: number }) {
  const colors = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xl, marginBottom: spacing.sm,
    }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>
        {title}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{owned}/{total} owned</Text>
    </View>
  );
}

// ─── Item detail bottom sheet ─────────────────────────────────────────────────
function ItemDetailSheet({
  item, visible, onClose, onAction, isBuying, balance,
}: {
  item: ShopItem | null; visible: boolean;
  onClose: () => void; onAction: () => void; isBuying: boolean; balance: number;
}) {
  const colors = useTheme();
  if (!item) return null;
  const color = colors.primary;
  const pal   = THEME_PREVIEW[item.id];

  const needsToBuy = !item.owned && item.price > 0;
  const canAfford  = balance >= item.price;
  const shortage   = item.price - balance;

  const label = item.equipped     ? 'Already Equipped'
    : item.owned                  ? 'Equip'
    : canAfford                   ? `Buy for ${item.price} coins`
    : `Need ${shortage} more coins`;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <View style={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        borderTopWidth: 3, borderTopColor: color,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
      }}>

        <View style={{
          width: 36, height: 4, borderRadius: 2,
          backgroundColor: colors.border, alignSelf: 'center',
        }} />

        <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
          <View style={{
            width: 76, height: 76, borderRadius: 18,
            backgroundColor: item.type === 'theme' ? (pal?.bg ?? item.color) : '#0d1120',
            borderWidth: 3, borderColor: color,
            shadowColor: color, shadowOpacity: 0.55, shadowRadius: 10,
            elevation: 8, overflow: 'hidden',
          }}>
            {item.type === 'theme' && pal && <ThemePreview pal={pal} size={76} />}
            {item.type === 'icon' && <IconPreview color={item.color} size={76} />}
          </View>

          <View style={{ flex: 1, gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{
                backgroundColor: `${colors.primary}18`, borderWidth: 1,
                borderColor: `${colors.primary}40`, borderRadius: 8,
                paddingHorizontal: 7, paddingVertical: 2,
              }}>
                <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '700' }}>
                  {item.type === 'icon' ? 'AVATAR' : 'THEME'}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900', lineHeight: 24 }}>
              {item.name}
            </Text>

            {needsToBuy ? (
              <View style={{ gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: COIN_GOLD, fontSize: 17, fontWeight: '900' }}>{item.price}</Text>
                  <Ionicons name="logo-bitcoin" size={15} color={COIN_GOLD} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>price</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: canAfford ? colors.success : colors.error, fontSize: 14, fontWeight: '800' }}>
                    {balance}
                  </Text>
                  <Ionicons name="logo-bitcoin" size={13} color={canAfford ? colors.success : colors.error} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    {canAfford ? 'available — you can afford it' : `available — need ${shortage} more`}
                  </Text>
                </View>
              </View>
            ) : item.owned && !item.equipped ? (
              <Text style={{ color: colors.success, fontSize: 13, fontWeight: '700' }}>✓ In your collection</Text>
            ) : item.equipped ? (
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>✓ Currently equipped</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          onPress={onAction}
          disabled={item.equipped || isBuying || (needsToBuy && !canAfford)}
          style={{
            backgroundColor: item.equipped
              ? `${color}22`
              : needsToBuy && !canAfford ? `${colors.error}22`
              : color,
            borderRadius: 14, paddingVertical: 15, alignItems: 'center',
            borderWidth: needsToBuy && !canAfford ? 1.5 : 0,
            borderColor: needsToBuy && !canAfford ? colors.error : 'transparent',
            opacity: item.equipped ? 0.55 : 1,
          }}
        >
          <Text style={{
            color: item.equipped ? color : needsToBuy && !canAfford ? colors.error : '#fff',
            fontSize: 16, fontWeight: '800',
          }}>
            {isBuying ? 'Processing…' : label}
          </Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ShopScreen() {
  const colors = useTheme();
  const { width } = useWindowDimensions();

  const contentW = width - spacing.lg * 2;
  const cols     = Math.min(MAX_COLS, Math.max(MIN_COLS, Math.floor((contentW + TILE_GAP) / (MIN_TILE_PX + TILE_GAP))));
  const tileSize = (contentW - (cols - 1) * TILE_GAP) / cols;

  const { data: catalog = [], isLoading } = useShopCatalog();
  const { data: xp } = useUserXP();
  usePreferences();

  const purchaseMutation = usePurchaseItem();
  const equipMutation    = useEquipItem();
  const [selected, setSelected] = useState<ShopItem | null>(null);

  const icons  = catalog.filter((i) => i.type === 'icon');
  const themes = catalog.filter((i) => i.type === 'theme');

  const handleAction = () => {
    if (!selected || selected.equipped) return;
    if (selected.owned || selected.price === 0) {
      equipMutation.mutate(selected.id, { onSuccess: () => setSelected(null) });
      return;
    }
    purchaseMutation.mutate(selected.id, { onSuccess: () => setSelected(null) });
  };

  return (
    <>
      <PageShell>

        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: spacing.lg,
        }}>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
              Spend your coins
            </Text>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>Shop</Text>
          </View>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: `${COIN_GOLD}15`, borderRadius: 20,
            paddingHorizontal: 13, paddingVertical: 8,
            borderWidth: 1, borderColor: `${COIN_GOLD}35`,
          }}>
            <Ionicons name="logo-bitcoin" size={15} color={COIN_GOLD} />
            <Text style={{ color: COIN_GOLD, fontSize: 15, fontWeight: '900' }}>{xp?.coins ?? 0}</Text>
          </View>
        </View>


        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 48 }} />
        ) : (
          <View>
            <SectionRow
              title="AVATAR COLORS"
              owned={icons.filter((i) => i.owned).length}
              total={icons.length}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP, justifyContent: 'center' }}>
              {icons.map((item) => (
                <ShopTile key={item.id} item={item} size={tileSize} onPress={() => setSelected(item)} />
              ))}
            </View>

            <SectionRow
              title="APP THEMES"
              owned={themes.filter((i) => i.owned).length}
              total={themes.length}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP, justifyContent: 'center', marginBottom: spacing.lg }}>
              {themes.map((item) => (
                <ShopTile key={item.id} item={item} size={tileSize} onPress={() => setSelected(item)} />
              ))}
            </View>
          </View>
        )}

      </PageShell>

      <ItemDetailSheet
        item={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
        onAction={handleAction}
        isBuying={purchaseMutation.isPending || equipMutation.isPending}
        balance={xp?.coins ?? 0}
      />
    </>
  );
}
