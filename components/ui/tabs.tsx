import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export type TabsProps = {
  items: string[];
  value: string;
  onChange: (val: string) => void;
};

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.tab, active ? styles.activeTab : null]}
          >
            <Text style={[styles.label, active ? styles.activeLabel : null]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  label: {
    color: '#000',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#fff',
  },
});