import { login as authServiceLogin, logout as authServiceLogout, getSession, onAuthStateChange } from '@/services/auth.service';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

type AuthContextValue = {
  isAuthenticated: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await getSession();
        setIsAuthenticated(!!result.data?.session);
      } catch (error) {

        setIsAuthenticated(false);
      } finally {
        setAuthReady(true);
      }
    };
    init();

    const { data: subscription } = onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription?.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authServiceLogin(email, password);
    if (!result.success) {
      Alert.alert('Error de acceso', result.error || 'Error desconocido');
      throw new Error(result.error);
    }
  };

  const logout = async () => {
    const result = await authServiceLogout();
    if (!result.success) {
      Alert.alert('Error al cerrar sesión', result.error || 'Error desconocido');
      throw new Error(result.error);
    }
  };

  const value = useMemo(() => ({ isAuthenticated, authReady, login, logout }), [isAuthenticated, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}