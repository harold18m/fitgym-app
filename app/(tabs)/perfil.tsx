import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { Screen } from '@/components/screen';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBar } from '@/components/ui/top-bar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function PerfilScreen() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    load();
  }, []);

  return (
    <Screen style={{ flex: 1 }}>
      <TopBar
        title="Perfil"
        showBack={false}
        rightIconName="gearshape.fill"
        onPressRight={() => Alert.alert('Configuración', 'Próximamente')}
      />

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
          <Button title="Editar" variant="secondary" onPress={() => { }} />
          <Button title="Cerrar sesión" variant="destructive" onPress={logout} />
        </CardFooter>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});