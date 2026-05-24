import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  getShopCatalog,
  getPreferences,
  purchaseItem,
  equipItem,
} from '../../../services/shop.service';
import { useThemeStore } from '../../../store/theme.store';
import { useAuthStore } from '../../../store/auth.store';

/** Obtiene el catálogo completo de items con estado de propiedad y equipamiento del usuario. */
export function useShopCatalog() {
  return useQuery({
    queryKey: ['shop-catalog'],
    queryFn: getShopCatalog,
    staleTime: 1000 * 60,
  });
}

/** Obtiene las preferencias visuales activas del usuario (tema e icono) y las aplica al store de tema. */
export function usePreferences() {
  const setPreferences = useThemeStore((s) => s.setPreferences);
  const accessToken = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ['shop-preferences'],
    queryFn: getPreferences,
    staleTime: 1000 * 60 * 5,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      setPreferences(query.data);
    }
  }, [query.data, setPreferences]);

  return query;
}

/** Mutation para comprar un item con coins; invalida el catálogo y el XP al completarse. */
export function usePurchaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => purchaseItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp'] });
    },
    onError: (err: Error) => {
      Alert.alert('Purchase failed', err.message);
    },
  });
}

/** Mutation para equipar un item comprado; actualiza el store de tema de forma inmediata. */
export function useEquipItem() {
  const queryClient = useQueryClient();
  const setPreferences = useThemeStore((s) => s.setPreferences);

  return useMutation({
    mutationFn: (itemId: string) => equipItem(itemId),
    onSuccess: (prefs) => {
      setPreferences(prefs);
      queryClient.invalidateQueries({ queryKey: ['shop-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['shop-preferences'] });
    },
    onError: (err: Error) => {
      Alert.alert('Equip failed', err.message);
    },
  });
}
