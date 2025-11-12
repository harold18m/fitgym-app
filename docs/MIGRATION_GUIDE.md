# Guía de Migración: Refactorizar Componentes Existentes

Esta guía muestra paso a paso cómo migrar componentes del patrón antiguo (useState + useEffect) al nuevo patrón con React Query y Custom Hooks.

## Template de Migración

### Paso 1: Identificar Operaciones de Datos

En tu componente actual, busca:
- Llamadas a servicios en `useEffect`
- Estado para datos (`setCliente`, `setUser`, etc.)
- Estado de loading/error

**Ejemplo Antiguo:**
```typescript
const [cliente, setCliente] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    const data = await fetchClienteByEmail(email);
    setCliente(data);
    setIsLoading(false);
  };
  loadData();
}, [email]);
```

### Paso 2: Reemplazar con Custom Hook

**Nuevo Patrón:**
```typescript
import { useClienteByEmail } from '@/hooks/queries/useCliente';

// Una sola línea reemplaza 10+ líneas de código
const { data: cliente, isLoading } = useClienteByEmail(email);
```

### Paso 3: Actualizar JSX para Mostrar Estados

**Antes:**
```typescript
{isLoading ? <ActivityIndicator /> : <Text>{cliente?.nombre}</Text>}
```

**Después:**
```typescript
import { Skeleton } from '@/components/ui/skeleton';

{isLoading ? <Skeleton style={{ width: 200, height: 20 }} /> : <Text>{cliente?.nombre}</Text>}
```

## Ejemplos por Tipo de Componente

### Ejemplo 1: Pantalla de Lectura Simple (Como Perfil)

**Antes:**
```typescript
export default function MiPantalla() {
  const [email, setEmail] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmail = async () => {
      const result = await getUser();
      setEmail(result.data?.user?.email ?? null);
    };
    loadEmail();
  }, []);

  useEffect(() => {
    const loadCliente = async () => {
      setIsLoading(true);
      if (!email) {
        setIsLoading(false);
        return;
      }
      const data = await fetchClienteByEmail(email);
      setCliente(data);
      setIsLoading(false);
    };
    loadCliente();
  }, [email]);

  return (
    <View>
      {isLoading ? <ActivityIndicator /> : (
        <Text>{cliente?.nombre}</Text>
      )}
    </View>
  );
}
```

**Después:**
```typescript
export default function MiPantalla() {
  const [email, setEmail] = useState<string | null>(null);
  
  // Cargar email del usuario
  useEffect(() => {
    const load = async () => {
      const result = await getUser();
      setEmail(result.data?.user?.email ?? null);
    };
    load();
  }, []);

  // Una sola línea para obtener y cachear datos
  const { data: cliente, isLoading } = useClienteByEmail(email);

  return (
    <View>
      {isLoading ? <Skeleton style={{ width: 200, height: 20 }} /> : (
        <Text>{cliente?.nombre}</Text>
      )}
    </View>
  );
}
```

**Reducción de código:**
- Antes: 42 líneas
- Después: 25 líneas
- **Reducción: 40%**

### Ejemplo 2: Formulario con Guardado (Como Editar Perfil)

**Antes:**
```typescript
export default function EditarPerfilScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      await updateCliente({
        nombre,
        email,
      });
      Alert.alert('Éxito', 'Datos actualizados');
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      <Input 
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre"
      />
      <Input 
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button 
        title="Guardar" 
        onPress={handleSave}
        disabled={isSaving}
      />
    </View>
  );
}
```

**Después:**
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProfileSchema } from '@/lib/validators';
import { useUpdateCliente } from '@/hooks/queries/useCliente';
import { showErrorAlert } from '@/lib/errors';

export default function EditarPerfilScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editProfileSchema),
  });
  
  const updateMutation = useUpdateCliente();

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync(data);
      Alert.alert('Éxito', 'Datos actualizados');
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
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input 
            {...field}
            placeholder="Email"
            error={errors.email?.message}
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

**Mejoras:**
- ✅ Validación automática con Zod
- ✅ Error handling centralizado
- ✅ Caché invalidación automática
- ✅ Menos líneas de código

### Ejemplo 3: Lista con Refetch

**Antes:**
```typescript
export default function ListaClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClientes = async () => {
      setIsLoading(true);
      const data = await fetchAllClientes();
      setClientes(data);
      setIsLoading(false);
    };
    loadClientes();
  }, []);

  const handleRefresh = async () => {
    const data = await fetchAllClientes();
    setClientes(data);
  };

  return (
    <FlatList
      data={clientes}
      refreshing={isLoading}
      onRefresh={handleRefresh}
      renderItem={({ item }) => <ClienteCard cliente={item} />}
    />
  );
}
```

**Después:**
```typescript
import { useClientes } from '@/hooks/queries/useCliente';

export default function ListaClientesScreen() {
  // React Query maneja caché, refetch y loading automáticamente
  const { data: clientes = [], isLoading, refetch } = useClientes();

  return (
    <FlatList
      data={clientes}
      refreshing={isLoading}
      onRefresh={() => refetch()}
      renderItem={({ item }) => <ClienteCard cliente={item} />}
    />
  );
}
```

**Ventajas:**
- ✅ Caché automático
- ✅ Refetch inteligente
- ✅ Menos estado manual
- ✅ Mejor performance

## Checklist de Migración

Cuando refactorices un componente, verifica:

- [ ] Identifiqué todos los `useState` para datos del servidor
- [ ] Reemplacé con el custom hook correspondiente
- [ ] Eliminé los `useEffect` que hacían fetch
- [ ] Actualicé el JSX para usar los estados del hook
- [ ] Agregué Skeleton loading si falta UI de carga
- [ ] Si es un formulario, cambié a React Hook Form
- [ ] Validé que no hay errores de compilación
- [ ] Probé el componente en el emulador

## Componentes Sugeridos para Refactorizar

1. **ejercicios.tsx** - Probablemente tenga lista de ejercicios
   - Reemplazar con `useEjercicios()` (crear si no existe)
   
2. **index.tsx** - Si tiene datos del usuario
   - Usar `useClienteByEmail()` o `useClienteById()`

3. Otros screens que hagan fetch de datos
   - Aplicar el mismo patrón

## Crear Nuevos Custom Hooks

Si necesitas hooks que no existen, sigue este patrón en `/hooks/queries/`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEjercicios, updateEjercicio } from '@/services/ejercicio.service';
import { Ejercicio } from '@/types/ejercicio';

// Query Hook
export function useEjercicios() {
  return useQuery({
    queryKey: ['ejercicios'],
    queryFn: () => fetchEjercicios(),
    select: (data: Ejercicio[]) => data, // Opcional: transformar datos
  });
}

// Mutation Hook
export function useUpdateEjercicio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ejercicio: Ejercicio) => updateEjercicio(ejercicio),
    onSuccess: () => {
      // Invalida caché después de actualizar
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
    },
  });
}
```

## Troubleshooting

### Problema: Los datos no se actualizan
**Solución:** React Query cachea por 5 minutos. Para actualización inmediata:
```typescript
const { refetch } = useClienteByEmail(email);
await refetch();
```

### Problema: El componente se renderiza muchas veces
**Solución:** Verifica que no tengas dependencias incorrectas en custom hooks.

### Problema: Los errores no se muestran
**Solución:** Usa `showErrorAlert()` en el catch:
```typescript
try {
  await mutate();
} catch (error) {
  showErrorAlert(error);
}
```

## Beneficios Después de la Migración

| Métrica | Valor |
|---------|-------|
| Reducción de código | -30 a 50% |
| Menos bugs | Mejor porque menos código |
| Performance | Mejor (caché automático) |
| Mantenibilidad | Mucho mejor |
| Testing | Más fácil (lógica en hooks) |

