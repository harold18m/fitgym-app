import { StyleSheet } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Fonts } from '@/constants/theme';

export default function EjerciciosScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Ejercicios
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Explora rutinas, planes y recomendaciones para tu entrenamiento.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});