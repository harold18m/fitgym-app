import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View
    >
      <Card style={styles.stepContainer}>
        <CardHeader title="Acciones rápidas" description="Atajos para tu día" />
        <CardContent>
          <View style={styles.actionsRow}>
            <Button title="Ver QR" variant="default" onPress={() => { }} />
            <Link href="/acceso">
              <Link.Trigger>
                <Button title="Acceso" variant="secondary" />
              </Link.Trigger>
            </Link>
            <Link href="/membresia">
              <Link.Trigger>
                <Button title="Membresía" variant="outline" />
              </Link.Trigger>
            </Link>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
