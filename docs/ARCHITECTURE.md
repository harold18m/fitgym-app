# Guía de Implementación: React Query & Custom Hooks

Este documento muestra ejemplos prácticos de cómo usar los nuevos patrones de arquitectura implementados en Phase 2.

## 1. Usando Custom Hooks para Queries

### Obtener datos de un cliente por email (con caché automático)

```typescript
import { useClienteByEmail } from '@/hooks/queries/useCliente';

export default function MiComponente() {
  const { data: cliente, isLoading, error } = useClienteByEmail('usuario@example.com');

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>{cliente?.nombre}</Text>
      <Text>{cliente?.email}</Text>
    </View>
  );
}
```

### Obtener datos por ID

```typescript
import { useClienteById } from '@/hooks/queries/useCliente';

export default function PerfilScreen() {
  const { data: cliente, isLoading } = useClienteById('123');

  // React Query se encargará de caché automáticamente
  // Los datos se cachean por 5 minutos (staleTime)
  // Los datos se limpian de la memoria después de 30 minutos
}
```

## 2. Usando Custom Hooks para Mutations (Actualizaciones)

### Actualizar perfil de usuario

```typescript
import { useUpdateCliente } from '@/hooks/queries/useCliente';

export default function EditarPerfilScreen() {
  const updateMutation = useUpdateCliente();

  const handleSave = async (datosActualizados: Partial<Cliente>) => {
    try {
      const resultado = await updateMutation.mutateAsync({
        ...cliente,
        ...datosActualizados,
      });
      
      // React Query invalida automáticamente el caché
      // y refetch de los datos relacionados
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button 
      title="Guardar" 
      disabled={updateMutation.isPending}
      onPress={() => handleSave({ nombre: 'Juan' })}
    />
  );
}
```

### Login con React Hook Form + Zod

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '@/lib/validators';
import { useLogin } from '@/hooks/queries/useAuth';

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="codigo"
        render={({ field }) => (
          <Input
            label="Código"
            {...field}
            error={errors.codigo?.message}
            disabled={isSubmitting}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Contraseña"
            {...field}
            secureTextEntry
            error={errors.password?.message}
            disabled={isSubmitting}
          />
        )}
      />
      <Button 
        title="Ingresar" 
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </View>
  );
}
```

## 3. Manejo de Errores Centralizado

```typescript
import { handleError, showErrorAlert, logger } from '@/lib/errors';

try {
  await fetchAlgoDelServidor();
} catch (error) {
  // Opción 1: Mostrar alerta al usuario
  showErrorAlert(error);

  // Opción 2: Registrar en logs (en desarrollo)
  logger.error('Mi operación falló', error);

  // Opción 3: Procesamiento personalizado
  const appError = handleError(error);
  if (appError.isNetworkError) {
    // Manejar error de red
  }
}
```

## 4. Validación con Zod

```typescript
import { loginFormSchema, editProfileSchema } from '@/lib/validators';

// Los esquemas están disponibles para:
// - loginFormSchema (código + password)
// - editProfileSchema (nombre, email, avatar_url)
// - createExerciseSchema (nombre, descripción)

// TypeScript infiere automáticamente los tipos:
type LoginFormData = z.infer<typeof loginFormSchema>;

// Validar datos manualmente
const validacion = loginFormSchema.safeParse({
  codigo: 'user123',
  password: 'secret',
});

if (!validacion.success) {
  console.error(validacion.error.errors);
}
```

## 5. Arquitectura en Capas

```
┌─────────────────────────────────────┐
│      React Components               │
│  (acceso.tsx, perfil.tsx, etc)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Custom Hooks (useCliente, etc)    │
│   - Maneja React Query              │
│   - Cachea automáticamente          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Services (auth, cliente)         │
│   - Lógica de negocio               │
│   - Llamadas a Supabase             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Supabase Client                  │
│   - Base de datos                   │
│   - Autenticación                   │
└─────────────────────────────────────┘
```

## 6. Caché Automático con React Query

React Query maneja el caché automáticamente:

```typescript
// Primera llamada: fetch de datos
const { data: cliente1 } = useClienteByEmail('user@example.com');

// Segunda llamada (dentro de 5 minutos): retorna datos cacheados
const { data: cliente2 } = useClienteByEmail('user@example.com');
// No hace petición al servidor, usa el caché

// Después de 5 minutos (staleTime):
// Los datos se marcan como "stale" pero se siguen cacheando
// Si haces otra petición, hace refetch en background

// Después de 30 minutos (gcTime):
// Los datos se eliminan de la memoria si no se usan
```

## 7. Invalidar Caché Manualmente

```typescript
// Cuando actualizas un cliente, el caché se invalida automáticamente
const updateMutation = useUpdateCliente();

// mutateAsync invalida el caché de ese cliente
// y también refetch de useClientes si existe
await updateMutation.mutateAsync(clienteActualizado);

// El componente automáticamente se re-renderiza con datos nuevos
```

## Próximos Pasos Recomendados

1. **Refactorizar otros screens** que usen el patrón antiguo (useState + useEffect)
2. **Agregar más formularios** siguiendo el patrón de `login.tsx`
3. **Considerar tests** con Jest + React Testing Library
4. **Sentry integration** si vas a producción (Phase 3)

## Beneficios de la Nueva Arquitectura

✅ **Separation of Concerns**: Lógica separada en services, hooks, componentes
✅ **Type Safety**: Zod schemas + TypeScript inference
✅ **Caching**: React Query maneja caché automáticamente
✅ **Error Handling**: Sistema centralizado para manejar errores
✅ **Form Validation**: React Hook Form + Zod integrados
✅ **Reusability**: Custom hooks pueden usarse en múltiples componentes
✅ **Maintainability**: Código más organizado y fácil de mantener
✅ **Performance**: Caché reduce llamadas innecesarias al servidor
