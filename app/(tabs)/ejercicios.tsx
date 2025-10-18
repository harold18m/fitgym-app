import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function EjerciciosScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#DDEFE9', dark: '#243B2F' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#808080"
          name="figure.walk"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Ejercicios
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Explora rutinas, planes y recomendaciones para tu entrenamiento.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});