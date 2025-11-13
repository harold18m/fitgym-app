import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { Screen } from '@/components/screen';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBar } from '@/components/ui/top-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useClienteByEmail } from '@/hooks/queries';
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
        const email = result.data?.user?.email;
        setUserEmail(email ?? null);
      } else {
        console.log('❌ Error en getUser:', result.error);
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
      // rightIconName="gearshape.fill"
      // onPressRight={() => Alert.alert('Configuración', 'Próximamente')}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 10 }}>
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
                    {cliente?.nombre ?? 'Nombre del Cliente'}
                  </ThemedText>
                )}
                {isLoading ? (
                  <Skeleton style={{ width: '50%', height: 14, marginBottom: 4 }} />
                ) : (
                  <ThemedText darkColor="#666">
                    {cliente?.fecha_registro
                      ? `Miembro desde ${new Date(cliente.fecha_registro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}`
                      : 'Miembro'
                    }
                  </ThemedText>
                )}
                {isLoading ? (
                  <Skeleton style={{ width: 80, height: 20, marginTop: 8 }} />
                ) : (
                  <Badge
                    label={cliente?.estado === 'activa' ? 'Activa' : cliente?.estado === 'vencida' ? 'Vencida' : 'Suspendida'}
                    variant={cliente?.estado === 'activa' ? 'success' : 'destructive'}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Mi membresía</ThemedText>
          <View style={styles.cardLight}>
            <View style={styles.membershipHeader}>
              <View style={{ flex: 1 }}>
                {isLoading ? (
                  <>
                    <Skeleton style={{ width: 150, height: 16, marginBottom: 4 }} />
                    <Skeleton style={{ width: 200, height: 14 }} />
                  </>
                ) : (
                  <>
                    <ThemedText type="defaultSemiBold" darkColor="#111">
                      {cliente?.membresias?.nombre ?? 'Sin membresía'}
                    </ThemedText>
                    <ThemedText darkColor="#666">
                      {cliente?.membresias?.tipo ?? 'Acceso'}
                    </ThemedText>
                  </>
                )}
              </View>
              <Badge
                label={cliente?.estado === 'activa' ? 'Activa' : 'Vencida'}
                variant={cliente?.estado === 'activa' ? 'success' : 'destructive'}
              />
            </View>
            <Separator />

            {/* Datos de membresía */}
            {isLoading ? (
              <>
                <Skeleton style={{ width: '100%', height: 16, marginBottom: 8 }} />
                <Skeleton style={{ width: '80%', height: 16, marginBottom: 8 }} />
              </>
            ) : (
              <>
                {cliente?.membresias?.modalidad && (
                  <View style={styles.infoRow}>
                    <ThemedText darkColor="#666">Modalidad</ThemedText>
                    <ThemedText type="defaultSemiBold" darkColor="#111">
                      {cliente.membresias.modalidad}
                    </ThemedText>
                  </View>
                )}
                {cliente?.membresias?.precio && (
                  <View style={styles.infoRow}>
                    <ThemedText darkColor="#666">Precio</ThemedText>
                    <ThemedText type="defaultSemiBold" darkColor="#111">
                      S/ {Number(cliente.membresias.precio).toFixed(2)}
                    </ThemedText>
                  </View>
                )}
                {/* {cliente?.membresias?.duracion && (
                  <View style={styles.infoRow}>
                    <ThemedText darkColor="#666">Duración</ThemedText>
                    <ThemedText type="defaultSemiBold" darkColor="#111">
                      {cliente.membresias.duracion} días
                    </ThemedText>
                  </View>
                )} */}
              </>
            )}

            <Separator />

            {/* Fechas de membresía */}
            {cliente?.fecha_inicio && (
              <View style={styles.infoRow}>
                <ThemedText darkColor="#666">Fecha de inicio</ThemedText>
                <ThemedText type="defaultSemiBold" darkColor="#111">
                  {new Date(cliente.fecha_inicio).toLocaleDateString('es-ES')}
                </ThemedText>
              </View>
            )}
            {cliente?.fecha_fin && (
              <View style={styles.infoRow}>
                <ThemedText darkColor="#666">Fecha de vencimiento</ThemedText>
                <ThemedText type="defaultSemiBold" darkColor="#111">
                  {new Date(cliente.fecha_fin).toLocaleDateString('es-ES')}
                </ThemedText>
              </View>
            )}

            {/* Características de la membresía */}
            {!isLoading && cliente?.membresias?.caracteristicas && cliente.membresias.caracteristicas.length > 0 && (
              <>
                <Separator />
                <View>
                  <ThemedText type="defaultSemiBold" darkColor="#111">Beneficios incluidos</ThemedText>
                  <View style={styles.benefitsList}>
                    {cliente.membresias.caracteristicas.map((caracteristica, index) => (
                      <ThemedText key={index} darkColor="#666">
                        • {caracteristica}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Estadísticas</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              {isLoading ? (
                <Skeleton style={{ width: 40, height: 24, marginBottom: 4 }} />
              ) : (
                <ThemedText type="defaultSemiBold" darkColor="#111">
                  {cliente?.asistencias ?? 0}
                </ThemedText>
              )}
              <ThemedText darkColor="#666">Total de visitas</ThemedText>
            </View>
            <View style={styles.statCard}>
              {isLoading ? (
                <Skeleton style={{ width: 40, height: 24, marginBottom: 4 }} />
              ) : (
                <ThemedText type="defaultSemiBold" darkColor="#111">
                  {cliente?.fecha_registro ? new Date(cliente.fecha_registro).toLocaleDateString('es-ES') : 'N/A'}
                </ThemedText>
              )}
              <ThemedText darkColor="#666">Miembro desde</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            {/* <Button title="Editar perfil" variant="secondary" onPress={() => Alert.alert('Editar', 'Próximamente')} />
            <Button title="Renovar membresía" onPress={() => Alert.alert('Renovar', 'Próximamente')} /> */}
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