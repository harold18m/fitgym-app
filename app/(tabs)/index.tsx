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
        <ThemedText type="subtitle">Entrenamiento de hoy</ThemedText>
        <View style={styles.cardLight}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText type="defaultSemiBold" darkColor="#111">Lunes - Tren superior</ThemedText>
              <ThemedText darkColor="#666">6 ejercicios programados</ThemedText>
            </View>
            <ThemedText darkColor="#4CAF50" style={{ fontSize: 12, fontWeight: '600' }}>
              2/6 completados
            </ThemedText>
          </View>
        </View>
        <Pressable style={styles.quickButton} onPress={() => router.push('/(tabs)/ejercicios')}>
          <ThemedText darkColor="#111">Continuar rutina</ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Estado del gimnasio</ThemedText>
        <View style={styles.cardLight}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText type="defaultSemiBold" darkColor="#111">Ocupación actual</ThemedText>
              <ThemedText darkColor="#666">Nivel moderado</ThemedText>
            </View>
            <View style={{ backgroundColor: '#FFA726', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>65%</ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.cardLight}>
          <ThemedText type="defaultSemiBold" darkColor="#111">Horarios menos concurridos</ThemedText>
          <ThemedText darkColor="#666">• 6:00 - 8:00 AM</ThemedText>
          <ThemedText darkColor="#666">• 2:00 - 4:00 PM</ThemedText>
          <ThemedText darkColor="#666">• 9:00 - 11:00 PM</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Tu progreso</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={[styles.cardLight, { flex: 1 }]}>
            <ThemedText type="defaultSemiBold" darkColor="#111">28</ThemedText>
            <ThemedText darkColor="#666" style={{ fontSize: 12 }}>Visitas este mes</ThemedText>
          </View>
          <View style={[styles.cardLight, { flex: 1 }]}>
            <ThemedText type="defaultSemiBold" darkColor="#111">156</ThemedText>
            <ThemedText darkColor="#666" style={{ fontSize: 12 }}>Total entrenamientos</ThemedText>
          </View>
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
