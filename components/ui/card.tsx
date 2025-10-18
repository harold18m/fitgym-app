import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
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
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  description: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#000',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});