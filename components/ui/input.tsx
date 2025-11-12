import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  secure?: boolean;
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
  secure,
}: InputProps) {
  const bg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputRef = useRef<TextInput>(null);

  const borderColor = error ? '#d32f2f' : '#000';
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, { color: textColor }]}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          secureTextEntry={!!secure && hidden}
          textContentType={secure ? 'password' : 'none'}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          selectTextOnFocus={false}
          keyboardType="default"
          returnKeyType="done"
          style={[styles.input, { backgroundColor: '#fff', color: '#000', borderColor }]}
          placeholderTextColor="#999"
        />
        {secure ? (
          <Pressable style={styles.toggle} onPress={() => setHidden(!hidden)}>
            <Ionicons name={hidden ? 'eye' : 'eye-off'} size={20} color="#000" />
          </Pressable>
        ) : null}
      </View>
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 36,
    fontSize: 16,
  },
  toggle: {
    position: 'absolute',
    right: 10,
    top: 10,
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