import { View } from 'react-native';
import type { ReactNode } from 'react';
import { makeStyles } from './AppCard.styles';
import { useTheme } from '../theme';

type AppCardProps = {
  children: ReactNode;
};

export function AppCard({ children }: AppCardProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return <View style={styles.base}>{children}</View>;
}
