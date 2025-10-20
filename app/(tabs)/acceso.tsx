import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';

export default function AccesoScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const [dni, setDni] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setNow(new Date());
    };
    loadUser();
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const fetchCliente = async () => {
      const email = user?.email;
      if (!email) return;
      const { data, error } = await supabase
        .from('clientes')
        .select('dni, estado, nombre_membresia')
        .eq('email', email)
        .single();
      if (error) {
        console.log('Error obteniendo cliente', error.message);
        setDni('');
        setEstado('');
        return;
      }
      setDni(data?.dni || '');
      setEstado((data?.estado as string) || '');
    };
    fetchCliente();
  }, [user?.email]);

  if (!isAuthenticated) {
    return (
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded, color: '#fff', textAlign: 'center', width: '100%' }}>
            Acceso
          </ThemedText>
        </ThemedView>
        <ThemedText style={{ color: '#fff', marginBottom: 12, textAlign: 'center' }}>Debes iniciar sesión para ver tu código de acceso.</ThemedText>
        <View style={{ alignItems: 'center' }}>
          <Button title="Ir al login" variant="secondary" onPress={() => router.push('/login')} />
        </View>
      </ThemedView>
    );
  }

  const value = dni ? dni : '';

  return (
    <ThemedView style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Card style={styles.card}>
        <CardHeader title="Tu código de acceso" description="Presenta el QR en recepción" align="center" />
        <CardContent>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.qrBox}>
              {value ? (
                <QRCode value={value} size={200} />
              ) : (
                <Skeleton style={{ width: 200, height: 200, borderRadius: 8 }} />
              )}
            </View>
            <Badge
              label={estado ? `Membresía ${estado}` : 'Membresía'}
              variant={estado === 'activa' ? 'success' : estado === 'vencida' ? 'destructive' : estado === 'pausada' ? 'warning' : 'secondary'}
              style={{ alignSelf: 'center', marginTop: 8 }}
            />
          </View>
        </CardContent>
      </Card>

      <View style={styles.clockContainer}>
        <ThemedText style={styles.clockText}>{now.toLocaleTimeString()}</ThemedText>
      </View>

      {fullScreen && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.qrBoxLarge}>
            {value ? (
              <QRCode value={value} size={280} />
            ) : (
              <Skeleton style={{ width: 280, height: 280, borderRadius: 8 }} />
            )}
          </View>
          <Button title="Cerrar" variant="secondary" onPress={() => setFullScreen(false)} />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    borderRadius: 12,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#000',
    borderWidth: 1,
  },
  qrBoxLarge: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderColor: '#000',
    borderWidth: 1,
  },
  clockContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  clockText: {
    color: '#fff',
    fontFamily: Fonts.rounded,
    fontSize: 20,
  },
  fullScreenOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
});