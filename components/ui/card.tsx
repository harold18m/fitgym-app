import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ title, description, align = 'left' }: { title: string; description?: string; align?: 'left' | 'center' }) {
  const centered = align === 'center';
  return (
    <View style={[styles.header, centered && { alignItems: 'center' }]}> 
      <Text style={[styles.title, centered && { textAlign: 'center' }]}>{title}</Text>
      {description ? <Text style={[styles.description, centered && { textAlign: 'center' }]}>{description}</Text> : null}
    </View>
  );
}

export function CardContent({ children }: PropsWithChildren) {
  return <View style={styles.content}>{children}</View>;
}

export function CardFooter({ children }: PropsWithChildren) {
  return <View style={styles.footer}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});