import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBar } from '@/components/ui/top-bar';
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

  // Usar siempre los primeros 8 caracteres del correo
  const value = user?.email?.substring(0, 8) || '';

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar showBack={false} title="Acceso al gimnasio" />

      <View style={styles.container}>
        <View style={styles.section}>
          {/* <ThemedText type="subtitle">Tu código de acceso</ThemedText> */}
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

          {/* <View style={styles.userInfo}>
            {estado && (
              <Badge
                label={estado === 'activo' ? 'Membresía Activa' : 'Membresía Inactiva'}
                variant={estado === 'activo' ? 'success' : 'destructive'}
              />
            )}
          </View> */}
        </View>

        <View style={styles.timeContainer}>
          <ThemedText type="defaultSemiBold" style={styles.timeText}>
            {now.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </ThemedText>
          {/* <ThemedText style={{ opacity: 0.7, textAlign: 'center' }}>
            Hora actual del sistema
          </ThemedText> */}
        </View>
      </View>
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
  userInfo: {
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  timeText: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
  },
});