import React from 'react';
import { Text, View } from 'react-native';

type CoinIconProps = {
  size?: number;
  color?: string;
};

export function CoinIcon({ size = 16, color = '#f0c040' }: CoinIconProps) {
  const innerSize = Math.max(4, Math.round(size * 0.62));
  const fontSize = Math.max(8, Math.round(size * 0.58));

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: Math.max(1, Math.round(size * 0.08)),
        borderColor: '#fff2a8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: color,
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          borderWidth: 1,
          borderColor: 'rgba(80, 45, 0, 0.28)',
        }}
      />
      <Text
        style={{
          color: '#5b3600',
          fontSize,
          fontWeight: '900',
          lineHeight: Math.round(fontSize * 1.05),
        }}
      >
        $
      </Text>
    </View>
  );
}
