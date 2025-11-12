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
import { useClienteByEmail } from '@/hooks/queries/useCliente';
import { getUser } from '@/services/auth.service';

export default function AccesoScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // Cargar email del usuario
  useEffect(() => {
    const loadUser = async () => {
      const result = await getUser();
      if (result.success) {
        setUserEmail(result.data?.user?.email ?? null);
      }
      setNow(new Date());
    };
    loadUser();
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // Usar hook con React Query para obtener cliente
  const { isLoading } = useClienteByEmail(userEmail);

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
  const value = userEmail?.substring(0, 8) || '';

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar showBack={false} title="Acceso al gimnasio" />

      <View style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
            Muestra este código QR en la entrada del gimnasio
          </ThemedText>
        </View>

        <View style={styles.qrContainer}>
          {!isLoading && value ? (
            <View style={styles.qrBox}>
              <QRCode value={value} size={220} />
            </View>
          ) : (
            <Skeleton style={{ width: 252, height: 252 }} />
          )}
        </View>

        <View style={styles.timeContainer}>
          <ThemedText type="defaultSemiBold" style={styles.timeText}>
            {now.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </ThemedText>
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