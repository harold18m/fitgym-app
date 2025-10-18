import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function MembresiaScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#F3E9D2', dark: '#3A2E17' }}
        headerImage={
          <IconSymbol
            size={280}
            color="#808080"
            name="creditcard.fill"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Membresía
          </ThemedText>
        </ThemedView>
        <ThemedText>
          Necesitas iniciar sesión para ver tu membresía.
        </ThemedText>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <ThemedText type="defaultSemiBold" style={styles.loginButtonText}>Ir al login</ThemedText>
        </TouchableOpacity>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F3E9D2', dark: '#3A2E17' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#808080"
          name="creditcard.fill"
          style={styles.headerImage}
        />
      }>
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
          <Button title="Ver planes" variant="secondary" onPress={() => {}} />
          <Button title="Renovar" variant="default" onPress={() => {}} />
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
    gap: 8,
    alignItems: 'center',
  },
});