import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Separator() {
  return <View style={styles.sep} />;
}

const styles = StyleSheet.create({
  sep: {
    height: 1,
    backgroundColor: '#000',
    opacity: 0.2,
    width: '100%',
  },
});