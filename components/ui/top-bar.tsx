import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNavigation } from '@react-navigation/native';

export type TopBarProps = {
  title?: string;
  leftIconName?: 'chevron.left';
  rightIconName?: Parameters<typeof IconSymbol>[0]['name'];
  onPressLeft?: () => void;
  onPressRight?: () => void;
  showBack?: boolean; // override visibility
};

function deriveTitle(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? 'index';
  const map: Record<string, string> = {
    index: 'Inicio',
    ejercicios: 'Ejercicios',
    membresia: 'Membresía',
    acceso: 'Acceso',
    perfil: 'Perfil',
    login: 'Login',
  };
  return map[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
}

export function TopBar({
  title,
  leftIconName = 'chevron.left',
  rightIconName,
  onPressLeft,
  onPressRight,
  showBack,
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const navigation = useNavigation();
  const router = useRouter();

  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const canGoBack = showBack ?? navigation.canGoBack();
  const computedTitle = title ?? deriveTitle(pathname);

  const handleBack = () => {
    if (onPressLeft) return onPressLeft();
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={8}
              onPress={handleBack}
              style={styles.iconBtn}
            >
              <IconSymbol name={leftIconName} size={24} color={textColor} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.center}>
          <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
            {computedTitle}
          </Text>
        </View>

        <View style={styles.side}>
          {rightIconName ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Acción"
              hitSlop={8}
              onPress={onPressRight}
              style={styles.iconBtn}
            >
              <IconSymbol name={rightIconName} size={24} color={textColor} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  side: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 8,
  },
});