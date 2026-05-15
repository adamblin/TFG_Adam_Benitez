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

export function useShopCatalog() {
  return useQuery({
    queryKey: ['shop-catalog'],
    queryFn: getShopCatalog,
    staleTime: 1000 * 60,
  });
}

export function usePreferences() {
  const setPreferences = useThemeStore((s) => s.setPreferences);

  const query = useQuery({
    queryKey: ['shop-preferences'],
    queryFn: getPreferences,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setPreferences(query.data);
    }
  }, [query.data, setPreferences]);

  return query;
}

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
