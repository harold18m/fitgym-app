# 🚀 Quick Start Guide - Nuevos Patrones

Una guía rápida para desarrolladores que necesitan entender los nuevos patrones sin leer toda la documentación.

## ⚡ 30 Segundos: Lo Más Importante

**Viejo (malo):**
```typescript
const [datos, setDatos] = useState(null);
useEffect(() => {
  fetchDatos().then(setDatos);
}, []);
```

**Nuevo (bueno):**
```typescript
const { data: datos } = useClienteByEmail('email');
```

**Eso es todo.** React Query cachea automáticamente. Sin useState, sin useEffect.

---

## 5 Minutos: Los 5 Patrones Clave

### 1️⃣ Leer Datos (Query)
```typescript
const { data: cliente, isLoading, error } = useClienteByEmail('user@example.com');
```

### 2️⃣ Escribir Datos (Mutation)
```typescript
const updateMutation = useUpdateCliente();
await updateMutation.mutateAsync({ nombre: 'Juan' });
// Caché se invalida automáticamente
```

### 3️⃣ Formularios
```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginFormSchema),
});
```

### 4️⃣ Validación
```typescript
import { loginFormSchema } from '@/lib/validators';
// Schema contiene tipos + validación
```

### 5️⃣ Errores
```typescript
try { } 
catch (error) { 
  showErrorAlert(error); 
}
```

---

## 🎯 Selecciona tu Caso de Uso

### Necesito... | Código

#### Leer datos de un cliente
```typescript
import { useClienteByEmail } from '@/hooks/queries/useCliente';

const { data: cliente } = useClienteByEmail(email);
```

#### Actualizar un cliente
```typescript
import { useUpdateCliente } from '@/hooks/queries/useCliente';

const updateMutation = useUpdateCliente();
await updateMutation.mutateAsync(clienteActualizado);
```

#### Hacer login
```typescript
import { useLogin } from '@/hooks/queries/useAuth';

const loginMutation = useLogin();
await loginMutation.mutateAsync({ codigo, password });
```

#### Validar un formulario
```typescript
import { loginFormSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginFormSchema),
});

// Ahora tienes validación automática + TypeScript
```

#### Mostrar un error
```typescript
import { showErrorAlert } from '@/lib/errors';

try { 
  // algo 
} 
catch (error) { 
  showErrorAlert(error); 
}
```

---

## 🔥 Patrones Anti

### ❌ NUNCA hagas esto

```typescript
// ❌ BAD: Fetch manual en useEffect
useEffect(() => {
  fetchCliente().then(setCliente);
}, []);

// ✅ GOOD: Usa el hook
const { data: cliente } = useClienteByEmail(email);
```

```typescript
// ❌ BAD: Múltiples useState para formulario
const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');
const [error, setError] = useState('');

// ✅ GOOD: Usa React Hook Form
const { control, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

```typescript
// ❌ BAD: Validación manual
if (!email.includes('@')) { setError('Email inválido'); }

// ✅ GOOD: Zod schema + React Hook Form
const { errors } = useForm({ resolver: zodResolver(schema) });
```

```typescript
// ❌ BAD: Alert.alert para cada error
Alert.alert('Error', error.message);

// ✅ GOOD: Función centralizada
showErrorAlert(error);
```

---

## 📂 Dónde Están las Cosas

```
Necesito...                              | Archivo
----------------------------------------|------------------
Custom hooks para queries               | /hooks/queries/useCliente.ts
Custom hooks para auth                  | /hooks/queries/useAuth.ts
Schemas de validación                   | /lib/validators.ts
Manejo de errores                       | /lib/errors.ts
Configuración de React Query            | /lib/query-client.tsx
Lógica de auth (low level)              | /services/auth.service.ts
Lógica de cliente (low level)           | /services/cliente.service.ts
Tipos de cliente                        | /types/cliente.ts
Tipos de auth                           | /types/auth.ts
```

---

## 🔄 Flujo de una Petición

```
Usuario toca botón
         ↓
Handler en componente
         ↓
Llama a mutation.mutateAsync()
         ↓
React Query intercepta
         ↓
Llama al service
         ↓
Service llama a Supabase
         ↓
Supabase retorna datos
         ↓
React Query invalida caché
         ↓
Componentes se re-renderan con datos nuevos
```

---

## 📋 Checklist: Crear un Nuevo Feature

### 1. Agregar tipo (si es nuevo)
```typescript
// /types/nuevo.ts
import { z } from 'zod';

export const nuevoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
});

export type Nuevo = z.infer<typeof nuevoSchema>;
```

### 2. Crear service
```typescript
// /services/nuevo.service.ts
import { supabase } from '@/utils/supabase';
import { Nuevo } from '@/types/nuevo';

export async function fetchNuevo(id: string) {
  const { data, error } = await supabase
    .from('nuevos')
    .select('*')
    .eq('id', id);
  
  if (error) throw error;
  return data[0] as Nuevo;
}
```

### 3. Crear custom hook
```typescript
// /hooks/queries/useNuevo.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNuevo } from '@/services/nuevo.service';

export function useNuevo(id: string) {
  return useQuery({
    queryKey: ['nuevo', id],
    queryFn: () => fetchNuevo(id),
  });
}
```

### 4. Usar en componente
```typescript
export default function PantallaComponent() {
  const { data: nuevo } = useNuevo(id);
  
  return <Text>{nuevo?.nombre}</Text>;
}
```

---

## 🎨 Template para Nuevo Screen

```typescript
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useNuevo } from '@/hooks/queries/useNuevo';
import { Skeleton } from '@/components/ui/skeleton';

export default function MiScreen() {
  // 1. Obtener datos
  const { data: nuevo, isLoading, error } = useNuevo('id');

  // 2. Mostrar loading
  if (isLoading) {
    return <Skeleton style={{ width: 200, height: 20 }} />;
  }

  // 3. Mostrar error
  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }

  // 4. Mostrar datos
  return (
    <View>
      <ThemedText>{nuevo?.nombre}</ThemedText>
    </View>
  );
}
```

---

## 🎨 Template para Formulario

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { miSchema } from '@/lib/validators';
import { useMiMutation } from '@/hooks/queries/useMi';
import { showErrorAlert } from '@/lib/errors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FormularioScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(miSchema),
  });

  const mutation = useMiMutation();

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      Alert.alert('Éxito', 'Guardado correctamente');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        name="nombre"
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Nombre"
            error={errors.nombre?.message}
          />
        )}
      />
      <Button
        title="Guardar"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </View>
  );
}
```

---

## 🆘 Troubleshooting Rápido

### "Los datos no se actualizan"
**Solución:** Los datos se cachean por 5 minutos. Para refetch inmediato:
```typescript
const { refetch } = useClienteByEmail(email);
await refetch();
```

### "Error no se muestra"
**Solución:** Usa `showErrorAlert` en el catch:
```typescript
try { } 
catch (error) { 
  showErrorAlert(error); 
}
```

### "Validación no funciona"
**Solución:** Verifica que usaste `zodResolver`:
```typescript
const { control } = useForm({
  resolver: zodResolver(schema), // ← No olvides esto
});
```

### "TypeScript grita sobre tipos"
**Solución:** Los tipos vienen del schema:
```typescript
type MiForm = z.infer<typeof miSchema>;
```

### "Componente se renderiza infinitas veces"
**Solución:** Revisa que las dependencias del hook sean correctas

---

## 📞 Ayuda Rápida

| Problema | Comando/Solución |
|----------|------------------|
| Ver todos los hooks | Ver `/hooks/queries/index.ts` |
| Ver todos los validators | Ver `/lib/validators.ts` |
| Ver ejemplo de error handling | Ver `login.tsx` |
| Ver ejemplo de mutation | Ver `useUpdateCliente()` en `useCliente.ts` |
| Entender React Query | Ver `ARCHITECTURE.md` |

---

## ✅ Antes de Pushear Código

- [ ] Compilar sin errores: TypeScript OK
- [ ] Imports correctos
- [ ] Usé custom hooks (no useState para datos del servidor)
- [ ] Validación con Zod si es formulario
- [ ] Manejo de errores con `showErrorAlert`
- [ ] Testeé en emulador
- [ ] No dejé console.logs

---

## 🎓 Próximo: Entender Más

Cuando estés listo, lee:
1. `ARCHITECTURE.md` - Conceptos profundos
2. `MIGRATION_GUIDE.md` - Cómo refactorizar
3. Código de `login.tsx` - Ejemplo funcional completo

---

**¡Listo para empezar!** Si tienes dudas, revisa los archivos de documentación o el código de `login.tsx` que es un ejemplo completo.

