import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  helperText,
  error,
  disabled,
  style,
}: InputProps) {
  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const borderColor = error ? '#d32f2f' : '#000';

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, { color: textColor }]}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        style={[styles.input, { backgroundColor: bg, color: textColor, borderColor }]}
        placeholderTextColor="#888"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  helper: {
    fontSize: 12,
    color: '#555',
  },
  error: {
    fontSize: 12,
    color: '#d32f2f',
  },
});