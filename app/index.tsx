import Logo from '@/components/logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, authReady } = useAuth();

  useEffect(() => {
    if (!authReady) return;
    router.replace(isAuthenticated ? '/(tabs)' : '/login');
  }, [authReady, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  }
});