import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { Screen } from '@/components/screen';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBar } from '@/components/ui/top-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useClienteByEmail } from '@/hooks/queries/useCliente';
import { getUser } from '@/services/auth.service';
import { useEffect, useState } from 'react';

export default function PerfilScreen() {
  const { logout } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Cargar email del usuario
  useEffect(() => {
    const load = async () => {
      const result = await getUser();
      if (result.success) {
        setUserEmail(result.data?.user?.email ?? null);
      }
    };
    load();
  }, []);

  // Usar hook con React Query para obtener cliente
  const { data: cliente, isLoading, error } = useClienteByEmail(userEmail);

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar
        title="Perfil"
        showBack={false}
        rightIconName="gearshape.fill"
        onPressRight={() => Alert.alert('Configuración', 'Próximamente')}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Información personal</ThemedText>
          <View style={styles.cardLight}>
            <View style={styles.row}>
              <Avatar
                size="lg"
                src={cliente?.avatar_url ? { uri: cliente.avatar_url } : undefined}
              />
              <View style={{ flex: 1 }}>
                {isLoading ? (
                  <Skeleton style={{ width: '60%', height: 16, marginBottom: 4 }} />
                ) : (
                  <ThemedText type="defaultSemiBold" darkColor="#111">
                    {userEmail?.substring(0, 8) ?? 'usuario@example.com'}
                  </ThemedText>
                )}
                <ThemedText darkColor="#666">Miembro desde enero 2024</ThemedText>
                <Badge label="Activo" variant="success" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Mi membresía</ThemedText>
          <View style={styles.cardLight}>
            <View style={styles.membershipHeader}>
              <View>
                <ThemedText type="defaultSemiBold" darkColor="#111">Plan Premium</ThemedText>
                <ThemedText darkColor="#666">Acceso completo al gimnasio</ThemedText>
              </View>
              <Badge label="Activa" variant="success" />
            </View>
            <Separator />
            <View style={styles.infoRow}>
              <ThemedText darkColor="#666">Fecha de inicio</ThemedText>
              <ThemedText type="defaultSemiBold" darkColor="#111">1 enero 2024</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText darkColor="#666">Próximo pago</ThemedText>
              <ThemedText type="defaultSemiBold" darkColor="#111">1 febrero 2024</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText darkColor="#666">Precio mensual</ThemedText>
              <ThemedText type="defaultSemiBold" darkColor="#111">$899 MXN</ThemedText>
            </View>
          </View>

          {/* <View style={styles.cardLight}>
            <ThemedText type="defaultSemiBold" darkColor="#111">Beneficios incluidos</ThemedText>
            <View style={styles.benefitsList}>
              <ThemedText darkColor="#666">• Acceso 24/7 al gimnasio</ThemedText>
              <ThemedText darkColor="#666">• Clases grupales ilimitadas</ThemedText>
              <ThemedText darkColor="#666">• Asesoría nutricional</ThemedText>
              <ThemedText darkColor="#666">• Rutinas personalizadas</ThemedText>
              <ThemedText darkColor="#666">• Acceso a zona de spa</ThemedText>
            </View>
          </View> */}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Estadísticas</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText type="defaultSemiBold" darkColor="#111">28</ThemedText>
              <ThemedText darkColor="#666">Visitas este mes</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText type="defaultSemiBold" darkColor="#111">156</ThemedText>
              <ThemedText darkColor="#666">Total de visitas</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            <Button title="Editar perfil" variant="secondary" onPress={() => Alert.alert('Editar', 'Próximamente')} />
            <Button title="Renovar membresía" onPress={() => Alert.alert('Renovar', 'Próximamente')} />
            <Button title="Cerrar sesión" variant="destructive" onPress={logout} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
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
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benefitsList: {
    gap: 4,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
});