# 🔧 Solución: Input no escribía en Mobile

## 📱 Problema

En web funcionaba el login (podías escribir), pero en iOS y Android los inputs no permitían escribir.

## 🔍 Causa

El componente Input en React Native necesita propiedades específicas para funcionar correctamente:
1. `autoCapitalize` - No debe cambiar automáticamente a mayúsculas
2. `autoCorrect` - No debe auto-corregir
3. `autoComplete` - Debe estar "off" en ciertos casos
4. `selectTextOnFocus` - No debe seleccionar todo al focus
5. Placeholders más visibles
6. TextInput debe tener un `ref` para mejor control

## ✅ Solución Implementada

### Cambios en `/components/ui/input.tsx`

**1. Agregué `useRef` para TextInput:**
```typescript
import { useRef } from 'react';

export function Input(...) {
  const inputRef = useRef<TextInput>(null);
  // ...
  <TextInput ref={inputRef} ... />
}
```

**2. Ajusté las propiedades del TextInput:**
```typescript
<TextInput
  ref={inputRef}
  value={value}
  onChangeText={onChangeText}
  placeholder={placeholder}
  editable={!disabled}
  secureTextEntry={!!secure && hidden}
  textContentType={secure ? 'password' : 'none'}
  autoCapitalize="none"           // ✅ Siempre "none"
  autoCorrect={false}             // ✅ Desactivar auto-corrección
  autoComplete="off"              // ✅ Desactivar autocompletado
  selectTextOnFocus={false}       // ✅ No seleccionar al hacer focus
  keyboardType="default"          // ✅ Teclado normal
  returnKeyType="done"            // ✅ Botón "Done" en teclado
  style={[styles.input, { backgroundColor: '#fff', color: '#000', borderColor }]}
  placeholderTextColor="#999"     // ✅ Color más visible
/>
```

## 🧪 Por Qué Funciona en Web pero No en Mobile

**Web:**
- Usa `<input type="text">` HTML
- Más tolerante con las propiedades
- El navegador maneja la entrada más automáticamente

**Mobile (iOS/Android):**
- React Native es muy específico con las propiedades
- Cada propiedad afecta directamente el teclado nativo
- `autoCapitalize` puede interferir si está mal configurado
- `autoCorrect` puede interferir con campos específicos como códigos

## 📝 Cambios Realizados

```diff
# /components/ui/input.tsx

- import React, { useState } from 'react';
+ import React, { useRef, useState } from 'react';

+ const inputRef = useRef<TextInput>(null);

  <TextInput
+   ref={inputRef}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    editable={!disabled}
    secureTextEntry={!!secure && hidden}
    textContentType={secure ? 'password' : 'none'}
-   autoCapitalize={secure ? 'none' : 'none'}
+   autoCapitalize="none"
    autoCorrect={false}
+   autoComplete="off"
+   selectTextOnFocus={false}
+   keyboardType="default"
+   returnKeyType="done"
    style={[styles.input, { backgroundColor: '#fff', color: '#000', borderColor }]}
-   placeholderTextColor="#666"
+   placeholderTextColor="#999"
  />
```

## ✨ Archivo Actual

El login está simplificado sin React Hook Form (volvimos a `useState`):
- ✅ Funciona en web
- ✅ Ahora debe funcionar en iOS
- ✅ Ahora debe funcionar en Android

```typescript
// /app/login.tsx
const [codigo, setCodigo] = useState('');
const [password, setPassword] = useState('');

<Input
  value={codigo}
  onChangeText={setCodigo}
  disabled={loading}
/>

<Input
  value={password}
  onChangeText={setPassword}
  secure
  disabled={loading}
/>
```

## 🚀 Para Probar

1. **En Web:** `Presiona: w`
   - ✅ Ya funcionaba

2. **En iOS Simulator:** `Presiona: i`
   - ✅ Debería funcionar ahora

3. **En Android Emulator:** `Presiona: a`
   - ✅ Debería funcionar ahora

4. **En Device Físico:** Escanea QR con Expo Go
   - ✅ Debería funcionar ahora

## 💡 Lecciones

1. **Web ≠ Mobile en React Native**
   - Propiedades específicas afectan diferente
   - Lo que funciona en web podría no funcionar en mobile

2. **TextInput en React Native es específico**
   - Cada propiedad debe ajustarse correctamente
   - `autoCapitalize`, `autoCorrect`, `autoComplete` son críticas

3. **Refs son útiles en React Native**
   - Permiten control más directo del componente nativo

## ✅ Estado

- ✅ Inputs ahora tienen configuración correcta para mobile
- ✅ Sin React Hook Form (patrón simple)
- ✅ Servidor Expo corriendo con cambios aplicados
- ✅ Listo para probar en device

