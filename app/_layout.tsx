import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack initialRouteName="index">
          {/* Splash inicial */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* Pantalla Login fuera de tabs */}
          <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
          {/* Tabs principales */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
