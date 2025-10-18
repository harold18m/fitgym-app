import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';

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
      <ParallaxScrollView headerBackgroundColor={{ light: '#fff', dark: '#000' }} headerImage={<View />}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Acceso
          </ThemedText>
        </ThemedView>
        <ThemedText>Debes iniciar sesión para ver tu código QR.</ThemedText>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <ThemedText type="defaultSemiBold" style={styles.loginButtonText}>Ir al login</ThemedText>
        </TouchableOpacity>
      </ParallaxScrollView>
    );
  }

  const value = user ? JSON.stringify({ type: 'fitgym-access', user_id: user.id, email: user.email }) : '';

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#fff', dark: '#000' }} headerImage={<View />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Acceso
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.qrContainer}>
        {user ? (
          <View style={styles.qrBox}>
            <QRCode value={value} size={220} color="#000" backgroundColor="#fff" />
            <ThemedText style={styles.qrLabel}>Tu código de acceso</ThemedText>
          </View>
        ) : (
          <ThemedText>Cargando usuario...</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
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
  loginButton: {
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  loginButtonText: {
    color: '#fff',
  },
});