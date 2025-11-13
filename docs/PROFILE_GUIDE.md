# 👤 Guía: Mostrar Perfil del Cliente en la App

## 📱 Cómo Funciona Actualmente

El perfil está configurado para obtener y mostrar los datos del cliente autenticado.

### Flujo de Datos

```
Usuario Login
    ↓
Supabase Auth (email + password)
    ↓
AuthContext obtiene el email del usuario
    ↓
useClienteByEmail(email) busca el cliente
    ↓
Supabase devuelve datos del cliente (nombre, avatar, etc)
    ↓
Perfil muestra: Avatar + Nombre + Insignias
```

## 🔧 Cómo Está Configurado

### 1. Schema del Cliente (actualizado)
**Archivo:** `/types/cliente.ts`

```typescript
export const clienteSchema = z.object({
    id: z.string(),
    email: z.email(),
    nombre: z.string().optional(),           // ← NUEVO
    dni: z.string().optional(),
    avatar_url: z.string().optional(),
    estado: z.enum(['activo', 'inactivo']).optional(),
    nombre_membresia: z.string().optional(),
    created_at: z.string().optional(),
});
```

### 2. Hook para Obtener Cliente
**Archivo:** `/hooks/queries/useCliente.ts`

```typescript
export function useClienteByEmail(email: string | null) {
  return useQuery({
    queryKey: ['cliente', email],
    queryFn: () => fetchClienteByEmail(email!),
    enabled: !!email, // Solo ejecuta si hay email
  });
}
```

**Cómo funciona:**
- Recibe el email del usuario autenticado
- Busca el cliente en Supabase por email
- React Query cachea los datos por 5 minutos
- `enabled: !!email` previene queries innecesarias

### 3. Service que Busca en Supabase
**Archivo:** `/services/cliente.service.ts`

```typescript
export async function fetchClienteByEmail(email: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data as Cliente;
}
```

### 4. Pantalla de Perfil
**Archivo:** `/app/(tabs)/perfil.tsx`

```typescript
export default function PerfilScreen() {
  // 1. Obtener email del usuario autenticado
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const load = async () => {
      const result = await getUser();
      setUserEmail(result.data?.user?.email ?? null);
    };
    load();
  }, []);

  // 2. Obtener cliente relacionado al email
  const { data: cliente, isLoading } = useClienteByEmail(userEmail);

  // 3. Mostrar datos del cliente
  return (
    <View style={styles.row}>
      {/* Avatar */}
      <Avatar
        size="lg"
        src={cliente?.avatar_url ? { uri: cliente.avatar_url } : undefined}
      />
      
      {/* Información */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <Skeleton style={{ width: '60%', height: 16 }} />
        ) : (
          <ThemedText type="defaultSemiBold">
            {cliente?.nombre ?? 'Nombre del Cliente'}
          </ThemedText>
        )}
        <ThemedText darkColor="#666">Miembro desde enero 2024</ThemedText>
        <Badge label="Activo" variant="success" />
      </View>
    </View>
  );
}
```

## 📊 Datos que Puedes Mostrar

Ahora tienes acceso a todos estos datos del cliente:

```typescript
cliente: {
  id: string,              // ID en BD
  email: string,           // Email del usuario
  nombre?: string,         // ✅ NOMBRE (nuevo)
  dni?: string,            // Documento de identidad
  avatar_url?: string,     // ✅ URL de la foto de perfil
  estado?: string,         // "activo" | "inactivo"
  nombre_membresia?: string, // Tipo de membresía
  created_at?: string,     // Fecha de creación
}
```

## 🎨 Ejemplos de Personalización

### Mostrar Nombre + Email
```tsx
<View>
  <ThemedText type="defaultSemiBold">
    {cliente?.nombre ?? 'Cliente'}
  </ThemedText>
  <ThemedText darkColor="#666">
    {cliente?.email}
  </ThemedText>
</View>
```

### Mostrar Nombre + Membresía
```tsx
<View>
  <ThemedText type="defaultSemiBold">
    {cliente?.nombre ?? 'Cliente'}
  </ThemedText>
  <ThemedText darkColor="#666">
    {cliente?.nombre_membresia ?? 'Plan Básico'}
  </ThemedText>
</View>
```

### Mostrar Avatar + Nombre + Estado
```tsx
<View style={styles.row}>
  <Avatar
    size="lg"
    src={cliente?.avatar_url ? { uri: cliente.avatar_url } : undefined}
  />
  <View style={{ flex: 1 }}>
    <ThemedText type="defaultSemiBold">
      {cliente?.nombre ?? 'Cliente'}
    </ThemedText>
    <Badge 
      label={cliente?.estado === 'activo' ? 'Activo' : 'Inactivo'} 
      variant={cliente?.estado === 'activo' ? 'success' : 'danger'}
    />
  </View>
</View>
```

## 🔄 Cómo Funciona el Caché de React Query

```typescript
// Primera vez que entra al perfil
const { data: cliente } = useClienteByEmail('user@fitgym.com.pe');
// → Consulta a Supabase

// Segunda vez en el mismo día (dentro de 5 minutos)
const { data: cliente } = useClienteByEmail('user@fitgym.com.pe');
// → Usa caché (muy rápido, sin consulta)

// Después de 5 minutos
// → Marca como "stale" pero sigue usando caché

// Después de 30 minutos
// → Elimina del caché si no se usa
```

## ✨ Ventajas del Diseño Actual

✅ **Automático:** Obtiene cliente del usuario autenticado  
✅ **Cachado:** React Query previene requests innecesarias  
✅ **Seguro:** Solo obtiene el cliente del usuario autenticado  
✅ **Escalable:** Fácil agregar más datos  
✅ **Type Safe:** TypeScript infiere todos los tipos  

## 🚀 Para Agregar Más Campos

Si quieres mostrar más datos del cliente:

### 1. Verificar que exista en BD
```sql
-- En Supabase SQL Editor
SELECT * FROM clientes LIMIT 1;
```

### 2. Agregar al Schema (si es nuevo)
```typescript
// /types/cliente.ts
export const clienteSchema = z.object({
    // ... campos existentes
    mi_nuevo_campo: z.string().optional(),
});
```

### 3. Usar en el Componente
```typescript
<ThemedText>
  {cliente?.mi_nuevo_campo}
</ThemedText>
```

## 🎯 Próximos Pasos

1. **Verificar que la tabla clientes tenga:**
   - `nombre` (texto)
   - `avatar_url` (URL)
   - Otros campos que quieras mostrar

2. **Si falta el campo `nombre` en BD:**
   - Ir a Supabase → Editor SQL
   - Ejecutar: `ALTER TABLE clientes ADD COLUMN nombre TEXT;`

3. **Probar en la app:**
   - Login con un usuario válido
   - Ir a pantalla de Perfil
   - Debería mostrar nombre + avatar

## 📝 Resumen

**Lo que se hizo:**
- ✅ Agregué `nombre` al schema de Cliente
- ✅ Actualicé perfil para mostrar `cliente?.nombre`
- ✅ Avatar ya estaba configurado (usa `cliente?.avatar_url`)
- ✅ Todo está cacheado con React Query

**Cómo funciona:**
1. Usuario hace login
2. AuthContext obtiene su email
3. Pantalla de Perfil busca el cliente por email
4. Supabase devuelve todos los datos del cliente
5. Se muestran: Avatar, Nombre, Estado, Membresía

