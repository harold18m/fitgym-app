import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export type GoogleIconProps = {
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function GoogleIcon({ size = 18, color = '#000', style }: GoogleIconProps) {
  return <AntDesign name="google" size={size} color={color} style={style} />;
}

export default GoogleIcon;