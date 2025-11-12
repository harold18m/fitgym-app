import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import GoogleIcon from '@/components/ui/google-icon';
import Logo from '@/components/logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async () => {
    if (!email || !password || !isPasswordValid) {
      Alert.alert('Revisa los campos', 'Email o contraseña inválidos');
      return;
    }
    try {
      setLoading(true);
      // concatenar email con dominio fijo
      const domain = '@fitgym.com.pe';
      const fullEmail = `${email}${domain}`;
      await login(fullEmail, password);
    } catch (e) {
      // Error visible desde AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          <View style={styles.titleContainer}>
            <Logo />
            <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
              Iniciar sesión
            </ThemedText>
          </View>

          <Card>
            <CardContent>
              <Input label="Código" placeholder="Tu código" value={email} onChangeText={setEmail} />
              <Input label="Contraseña" placeholder="••••••" value={password} onChangeText={setPassword} secure />
              <Button title={loading ? 'Entrando…' : 'Entrar'} variant="default" onPress={onSubmit} disabled={loading} />
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
});