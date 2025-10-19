import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

export default function AccesoScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    loadUser();
  }, []);

  if (!isAuthenticated) {
    return (
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Acceso
          </ThemedText>
        </ThemedView>
        <ThemedText>Debes iniciar sesión para ver tu código QR.</ThemedText>
        <Button title="Ir al login" variant="secondary" onPress={() => router.push('/login')} />
      </ThemedView>
    );
  }

  const value = user ? JSON.stringify({ type: 'fitgym-access', user_id: user.id, email: user.email }) : '';

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Acceso
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.qrContainer}>
        {user ? (
          <View style={styles.qrBox}>
            <QRCode value={value} size={180} />
          </View>
        ) : (
          <ThemedText>No se encontró usuario.</ThemedText>
        )}
        <ThemedText style={styles.qrLabel}>Presenta este código en recepción</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  qrContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#000',
    borderWidth: 1,
  },
  qrLabel: {
    marginTop: 8,
    color: '#000',
    textAlign: 'center',
  },

});