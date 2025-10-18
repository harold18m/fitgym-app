import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

export default function PerfilScreen() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    load();
  }, []);

  if (!isAuthenticated) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#E7E7F9', dark: '#2E2E47' }}
        headerImage={
          <IconSymbol
            size={280}
            color="#808080"
            name="person.crop.circle"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Perfil
          </ThemedText>
        </ThemedView>
        <ThemedText>
          Necesitas iniciar sesión para ver tu perfil.
        </ThemedText>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <ThemedText type="defaultSemiBold" style={styles.loginButtonText}>Ir al login</ThemedText>
        </TouchableOpacity>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E7E7F9', dark: '#2E2E47' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#808080"
          name="person.crop.circle"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Perfil
        </ThemedText>
      </ThemedView>

      <Card>
        <CardHeader title="Tu cuenta" description="Resumen de perfil y estado" />
        <CardContent>
          <View style={styles.row}>
            <Avatar size="lg" name={user?.email ?? 'Usuario FitGym'} />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{user?.email ?? 'usuario@example.com'}</ThemedText>
              <Badge label="Activo" variant="success" />
            </View>
          </View>
          <Separator />
          {user ? (
            <>
              <ThemedText>Usuario ID</ThemedText>
              <ThemedText type="defaultSemiBold">{user.id}</ThemedText>
            </>
          ) : (
            <>
              <Skeleton style={{ height: 12, width: '40%' }} />
              <Skeleton style={{ height: 12, width: '80%', marginTop: 6 }} />
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button title="Editar" variant="secondary" onPress={() => {}} />
          <Button title="Cerrar sesión" variant="destructive" onPress={logout} />
        </CardFooter>
      </Card>
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
  loginButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});