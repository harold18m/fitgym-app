import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';
import { Screen } from '@/components/screen';
import { TopBar } from '@/components/ui/top-bar';

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
      <Screen contentPadding={20} style={{ flex: 1 }}>
        <TopBar />
        <ThemedText style={{ color: '#fff', marginBottom: 12, textAlign: 'center' }}>
          Debes iniciar sesión para ver tu código de acceso.
        </ThemedText>
        <View style={{ alignItems: 'center' }}>
          <Button title="Ir al login" variant="secondary" onPress={() => router.push('/login')} />
        </View>
      </Screen>
    );
  }

  const value = dni ? dni : '';

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar title="Acceso al gimnasio" />
      
      <View style={styles.container}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Tu código de acceso</ThemedText>
          <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
            Muestra este código QR en la entrada del gimnasio
          </ThemedText>
        </View>

        <View style={styles.qrContainer}>
          {value ? (
            <View style={styles.qrBox}>
              <QRCode value={value} size={220} />
            </View>
          ) : (
            <Skeleton style={{ width: 252, height: 252 }} />
          )}
          
          <View style={styles.userInfo}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
              {user?.email || 'Cargando...'}
            </ThemedText>
            <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
              {dni ? `ID: ${dni}` : 'Obteniendo información...'}
            </ThemedText>
            {estado && (
              <Badge 
                label={estado === 'activo' ? 'Membresía Activa' : 'Membresía Inactiva'} 
                variant={estado === 'activo' ? 'success' : 'destructive'} 
              />
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Ampliar código"
            variant="secondary"
            onPress={() => setFullScreen(true)}
            disabled={!value}
          />
        </View>

        <View style={styles.timeContainer}>
          <ThemedText type="defaultSemiBold" style={styles.timeText}>
            {now.toLocaleTimeString('es-MX', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </ThemedText>
          <ThemedText style={{ opacity: 0.7, textAlign: 'center' }}>
            Hora actual del sistema
          </ThemedText>
        </View>
      </View>

      {fullScreen && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.qrBoxLarge}>
            <QRCode value={value} size={300} />
          </View>
          <ThemedText style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>
            {user?.email}
          </ThemedText>
          <ThemedText style={{ color: '#fff', textAlign: 'center', opacity: 0.8 }}>
            {dni ? `ID: ${dni}` : 'Cargando información...'}
          </ThemedText>
          <Button title="Cerrar" variant="secondary" onPress={() => setFullScreen(false)} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  section: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrBoxLarge: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  timeText: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
  },
  fullScreenOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 20,
  },
});