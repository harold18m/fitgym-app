import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export type BadgeProps = {
  label: string;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const v = getVariant(variant);
  return (
    <View style={[styles.container, { backgroundColor: v.bg, borderColor: v.border }]}> 
      <Text style={[styles.label, { color: v.text }]}>{label}</Text>
    </View>
  );
}

function getVariant(variant: BadgeProps['variant']) {
  switch (variant) {
    case 'secondary':
      return { bg: '#fff', text: '#000', border: '#000' };
    case 'outline':
      return { bg: 'transparent', text: '#000', border: '#000' };
    case 'success':
      return { bg: '#1b5e20', text: '#fff', border: '#1b5e20' };
    case 'warning':
      return { bg: '#f9a825', text: '#000', border: '#f9a825' };
    case 'destructive':
      return { bg: '#d32f2f', text: '#fff', border: '#d32f2f' };
    default:
      return { bg: '#000', text: '#fff', border: '#000' };
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});