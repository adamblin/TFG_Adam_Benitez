import { View } from 'react-native';
import type { ReactNode } from 'react';
import { styles } from './AppCard.styles';

type AppCardProps = {
  children: ReactNode;
};

export function AppCard({ children }: AppCardProps) {
  return <View style={styles.base}>{children}</View>;
}
