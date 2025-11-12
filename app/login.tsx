import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import Logo from '@/components/logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { showErrorAlert } from '@/lib/errors';
import { loginFormSchema, type LoginFormData } from '@/lib/validators';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { codigo: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Concatenar código con dominio fijo
      const domain = '@fitgym.com.pe';
      const fullEmail = `${data.codigo}${domain}`;
      await login(fullEmail, data.password);
    } catch (error) {
      showErrorAlert(error, 'Error de acceso');
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
              <Controller
                control={control}
                name="codigo"
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Código"
                    placeholder="Tu código"
                    value={value}
                    onChangeText={onChange}
                    error={errors.codigo?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Contraseña"
                    placeholder="••••••"
                    value={value}
                    onChangeText={onChange}
                    secure
                    error={errors.password?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Button
                title={isSubmitting ? 'Entrando…' : 'Entrar'}
                variant="default"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
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