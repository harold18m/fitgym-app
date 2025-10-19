import { StyleSheet, View } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function MembresiaScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Membresía
          </ThemedText>
        </ThemedView>
        <ThemedText>Necesitas iniciar sesión para ver tu membresía.</ThemedText>
        <Button title="Ir al login" variant="secondary" onPress={() => router.push('/login')} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Membresía
        </ThemedText>
      </ThemedView>

      <Card>
        <CardHeader title="Tu plan" description="Estado y vencimiento" />
        <CardContent>
          <View style={styles.row}>
            <Badge label="Básico" variant="secondary" />
            <Badge label="Vence en 12 días" variant="warning" />
          </View>
          <Separator />
          <ThemedText>Detalles</ThemedText>
          <Skeleton style={{ height: 12, width: '70%' }} />
          <Skeleton style={{ height: 12, width: '50%' }} />
          <Skeleton style={{ height: 12, width: '60%' }} />
        </CardContent>
        <CardFooter>
          <Button title="Ver planes" variant="secondary" onPress={() => { }} />
          <Button title="Renovar" variant="default" onPress={() => { }} />
        </CardFooter>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});