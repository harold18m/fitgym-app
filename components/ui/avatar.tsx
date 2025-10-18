import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  src?: ImageSourcePropType;
  name?: string; // fallback initials
};

export function Avatar({ size = 'md', src, name }: AvatarProps) {
  const dimension = size === 'sm' ? 32 : size === 'lg' ? 64 : 48;

  if (src) {
    return <Image source={src} style={{ width: dimension, height: dimension, borderRadius: 999 }} />;
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : '?';

  return (
    <View style={[styles.fallback, { width: dimension, height: dimension, borderRadius: 999 }]}> 
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});