import React from 'react';
import { SafeAreaProvider, SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

export type ScreenProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
  contentPadding?: number;
};

export function Screen({ style, edges = [], lightColor, darkColor, ...otherProps }: ScreenProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={edges}
        style={[style]}
        {...otherProps}
      />
    </SafeAreaProvider>
  );
}