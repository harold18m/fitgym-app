import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'default',
  size = 'md',
  style,
}: ButtonProps) {
  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const { container, label } = getStyles({ variant, size, bg, textColor, disabled });

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#00000022' }}
      style={({ pressed }) => [container, pressed && { opacity: 0.95 }, style]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantColors[variant].content(textColor)} />
      ) : (
        <Text style={label}>{title}</Text>
      )}
    </Pressable>
  );
}

const variantColors = {
  default: {
    bg: (bg: string) => '#000',
    border: () => '#000',
    content: () => '#fff',
  },
  secondary: {
    bg: () => '#fff',
    border: () => '#000',
    content: () => '#000',
  },
  outline: {
    bg: (bg: string) => bg,
    border: () => '#000',
    content: (text: string) => '#000',
  },
  ghost: {
    bg: (bg: string) => bg,
    border: () => 'transparent',
    content: (text: string) => text,
  },
  destructive: {
    bg: () => '#d32f2f',
    border: () => '#d32f2f',
    content: () => '#fff',
  },
} as const;

function getStyles({
  variant,
  size,
  bg,
  textColor,
  disabled,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  bg: string;
  textColor: string;
  disabled?: boolean;
}) {
  const v = variantColors[variant];
  const padding = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 16 : 15;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: v.bg(bg),
      borderColor: v.border(),
      borderWidth: variant === 'ghost' ? 0 : 1,
      paddingVertical: padding,
      paddingHorizontal: padding * 1.25,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    },
    label: {
      color: v.content(textColor),
      fontSize,
      fontWeight: '600',
    },
  });

  return styles;
}