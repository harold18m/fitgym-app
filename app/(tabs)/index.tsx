import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TopBar } from '@/components/ui/top-bar';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar title='Fitgym' showBack={false} rightIconName="bell.fill" />

      <View style={styles.section}>
        <ThemedText type="subtitle">Tu progreso</ThemedText>
        <View style={styles.cardLight}>
          <ThemedText darkColor="#111">Visitas este mes</ThemedText>
          <ThemedText type="defaultSemiBold" darkColor="#111">8</ThemedText>
        </View>
        <View style={styles.cardLight}>
          <ThemedText darkColor="#111">Última visita</ThemedText>
          <ThemedText type="defaultSemiBold" darkColor="#111">Ayer</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Notificaciones</ThemedText>
        <View style={styles.cardLight}>
          <ThemedText darkColor="#111">Tu membresía vence en 5 días.</ThemedText>
          <ThemedText darkColor="#555">Actualiza tu plan para continuar.</ThemedText>
        </View>
        <View style={styles.cardLight}>
          <ThemedText darkColor="#111">Nueva rutina disponible.</ThemedText>
          <ThemedText darkColor="#555">Explora ejercicios recomendados.</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Accesos directos</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Pressable style={styles.quickButton} onPress={() => router.push('/(tabs)/acceso')}>
            <ThemedText darkColor="#111">Ver QR</ThemedText>
          </Pressable>
          <Pressable style={styles.quickButton} onPress={() => router.push('/(tabs)/perfil')}>
            <ThemedText darkColor="#111">Perfil</ThemedText>
          </Pressable>
          <Pressable style={styles.quickButton} onPress={() => router.push('/(tabs)/ejercicios')}>
            <ThemedText darkColor="#111">Ejercicios</ThemedText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    gap: 8,
  },
  cardLight: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    gap: 4,
  },
  quickButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
