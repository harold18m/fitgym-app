import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import GoogleIcon from '@/components/ui/google-icon';
import Logo from '@/components/logo';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async () => {
    if (!email || !password || !isEmailValid || !isPasswordValid) {
      Alert.alert('Revisa los campos', 'Email o contraseña inválidos');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (e) {
      // Error visible desde AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Eliminado: onGoogle y botón de Google

  return (
    <ThemedView style={styles.container}>
      <Logo style={styles.logo as any} />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ color: '#fff' }}>
          Iniciar sesión
        </ThemedText>
      </ThemedView>

      <Card style={styles.card}>
        <CardContent>
          <Input
            label="Email"
            placeholder="email@fitgym.com"
            value={email}
            onChangeText={setEmail}
            error={!isEmailValid && email.length > 0 ? 'Ingresa un email válido' : undefined}
            helperText={email.length === 0 ? '' : undefined}
          />
          <Input
            label="Contraseña"
            placeholder="********"
            value={password}
            secure
            onChangeText={setPassword}
            error={!isPasswordValid && password.length > 0 ? 'Mínimo 6 caracteres' : undefined}
            helperText={password.length === 0 ? '' : undefined}
          />

          <View style={{ height: 12 }} />

          <Button title="Ingresar" onPress={onSubmit} loading={loading} size="lg" />

          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <Button title="¿Olvidaste tu contraseña?" variant="ghost" onPress={() => Alert.alert('Recuperar contraseña', 'Próximamente')} />
          </View>
        </CardContent>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    maxWidth: 420,
    alignSelf: 'center',
    margin: 16,
    width: '90%',
  },
});