import { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Completa ambos campos');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      Alert.alert('Sesión iniciada', `Bienvenido ${email}`);
    } catch (e) {
      // Error visible desde AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#000', dark: '#000' }} headerImage={<View />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, color: '#fff' }}>
          Iniciar sesión
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" />
              <ThemedText type="defaultSemiBold" style={[styles.buttonText, styles.loadingText]}>Ingresando...</ThemedText>
            </View>
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Ingresar</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  form: {
    gap: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
  },
});