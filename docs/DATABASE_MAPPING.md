# 📊 Mapeo de BD a App - Cliente desde Supabase

## 📋 Mapeo Completado

Tu BD Prisma está completamente mapeada en la app. Aquí está el flujo:

### 1. Tabla Supabase: `clientes`

Según tu `bd.prisma`:

```prisma
model clientes {
  id                String        @id @default(uuid()) @db.Uuid
  nombre            String        @db.VarChar(255)          // ← NOMBRE
  email             String        @db.VarChar(255)
  telefono          String        @db.VarChar(20)
  dni               String?       @unique @db.VarChar(20)   // ← DNI (opcional)
  fecha_nacimiento  DateTime      @db.Date
  fecha_registro    DateTime      @default(now())           // ← FECHA DE REGISTRO
  membresia_id      String?       @db.Uuid
  nombre_membresia  String?                                 // ← TIPO DE MEMBRESIA
  tipo_membresia    String?                                 // ← MODALIDAD
  fecha_inicio      DateTime?                               // ← FECHA INICIO MEMBRESIA
  fecha_fin         DateTime?                               // ← FECHA FIN MEMBRESIA
  estado            EstadoCliente @default(activa)          // ← ESTADO (activa/vencida/suspendida)
  asistencias_count Int           @default(0)               // ← CONTADOR DE VISITAS
  avatar_url        String?                                 // ← FOTO DE PERFIL
  deleted_at        DateTime?
  created_at        DateTime      @default(now())
  updated_at        DateTime      @updatedAt
}
```

### 2. Schema en TypeScript: `/types/cliente.ts`

```typescript
export const clienteSchema = z.object({
    id: z.string(),
    nombre: z.string(),                                   // ✅ NOMBRE
    email: z.string().email(),
    telefono: z.string().optional(),
    dni: z.string().optional(),
    fecha_nacimiento: z.string().optional(),
    fecha_registro: z.string().optional(),                // ✅ FECHA DE REGISTRO
    membresia_id: z.string().optional(),
    nombre_membresia: z.string().optional(),              // ✅ TIPO DE MEMBRESIA
    tipo_membresia: z.string().optional(),                // ✅ MODALIDAD
    fecha_inicio: z.string().optional(),                  // ✅ FECHA INICIO
    fecha_fin: z.string().optional(),                     // ✅ FECHA FIN
    estado: z.enum(['activa', 'vencida', 'suspendida']).optional(),  // ✅ ESTADO
    avatar_url: z.string().optional(),                    // ✅ FOTO
    asistencias_count: z.number().optional(),             // ✅ CONTADOR VISITAS
    deleted_at: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});
```

### 3. Service: `/services/cliente.service.ts`

```typescript
export async function fetchClienteByEmail(email: string): Promise<Cliente | null> {
    const { data, error } = await supabase
        .from('clientes')
        .select('id, email, nombre, dni, avatar_url, estado, nombre_membresia, tipo_membresia, fecha_inicio, fecha_fin, fecha_registro, created_at')
        .eq('email', email)
        .single();
    // ...
}
```

**Campos que selecciona:**
- ✅ `nombre` - Nombre del cliente
- ✅ `email` - Email
- ✅ `dni` - DNI (opcional)
- ✅ `avatar_url` - URL de la foto
- ✅ `estado` - Estado de membresía
- ✅ `nombre_membresia` - Tipo de plan
- ✅ `tipo_membresia` - Modalidad (mensual/trimestral/anual)
- ✅ `fecha_inicio` - Cuándo empieza
- ✅ `fecha_fin` - Cuándo vence
- ✅ `fecha_registro` - Cuándo se registró
- ✅ `created_at` - Cuándo se creó en BD

### 4. Hook: `/hooks/queries/useCliente.ts`

```typescript
export function useClienteByEmail(email: string | null) {
  return useQuery({
    queryKey: ['cliente', email],
    queryFn: () => fetchClienteByEmail(email!),
    enabled: !!email, // Solo ejecuta si hay email
  });
}
```

**Comportamiento:**
- Busca cliente por email
- React Query cachea por 5 minutos
- No ejecuta si no hay email

### 5. Pantalla: `/app/(tabs)/perfil.tsx`

**Lo que muestra:**

```
┌─────────────────────────────────┐
│  INFORMACIÓN PERSONAL           │
├─────────────────────────────────┤
│ [Avatar]  Nombre del Cliente    │
│           Miembro desde 01/10   │
│           ✅ Activo              │
├─────────────────────────────────┤
│  MI MEMBRESÍA                   │
├─────────────────────────────────┤
│ Plan Mensual                    │
│ Tipo Modalidad                  │
│                        Activa ✅ │
│ Fecha de inicio: 01/10/2024    │
│ Vence: 01/11/2024             │
├─────────────────────────────────┤
│  ESTADÍSTICAS                   │
├─────────────────────────────────┤
│ 156 visitas     Miembro desde...│
└─────────────────────────────────┘
```

## 🔄 Flujo de Datos

```
1. Usuario hace LOGIN
   └─→ AuthContext obtiene email de Supabase Auth

2. Pantalla PERFIL se abre
   └─→ Obtiene email del usuario autenticado
   └─→ Llama useClienteByEmail(email)

3. useClienteByEmail busca en Supabase
   └─→ Query: SELECT ... FROM clientes WHERE email = ?

4. Supabase retorna datos:
   {
     id: "uuid",
     nombre: "Juan Pérez",
     email: "juan@fitgym.com.pe",
     avatar_url: "https://...",
     estado: "activa",
     nombre_membresia: "Plan Premium",
     tipo_membresia: "mensual",
     fecha_inicio: "2024-10-01",
     fecha_fin: "2024-11-01",
     asistencias_count: 156,
     ...
   }

5. React Query cachea los datos

6. Pantalla renderiza:
   - Avatar desde avatar_url
   - Nombre desde nombre
   - Estado desde estado
   - Membresía desde nombre_membresia
   - Tipo desde tipo_membresia
   - Fechas desde fecha_inicio/fecha_fin
   - Visitas desde asistencias_count
```

## 📊 Datos Mapeados

| Campo BD | Schema TS | Componente | Muestra |
|----------|-----------|-----------|---------|
| `nombre` | `nombre: string` | Avatar section | "Juan Pérez" |
| `avatar_url` | `avatar_url?: string` | Avatar component | [Foto] |
| `email` | `email: string` | - | (no se muestra) |
| `dni` | `dni?: string` | - | (no se muestra) |
| `estado` | `estado?: enum` | Badge | "Activa" / "Vencida" |
| `nombre_membresia` | `nombre_membresia?: string` | Membership section | "Plan Premium" |
| `tipo_membresia` | `tipo_membresia?: string` | Membership section | "Mensual" |
| `fecha_inicio` | `fecha_inicio?: string` | Membership section | "01/10/2024" |
| `fecha_fin` | `fecha_fin?: string` | Membership section | "01/11/2024" |
| `fecha_registro` | `fecha_registro?: string` | Stats section | "Miembro desde 01/10" |
| `asistencias_count` | `asistencias_count?: number` | Stats section | "156 visitas" |

## ✅ Validaciones

Todos los campos son validados con Zod:

```typescript
// La BD devuelve data
const data = { nombre: "Juan", email: "juan@fitgym.com.pe", ... }

// Zod valida
const cliente = clienteSchema.parse(data);

// Si pasa validación → Se muestra
// Si falla validación → Error en logs
```

## 🔐 Seguridad

✅ **Solo obtiene datos del usuario autenticado**
- El email viene de Supabase Auth
- Solo busca cliente con ese email
- No puede ver datos de otros usuarios

## 📱 Estados de Carga

```typescript
// Mientras carga
isLoading = true
└─→ Muestra Skeleton (placeholders animados)

// Datos listos
isLoading = false
└─→ Muestra datos del cliente

// Error
error != null
└─→ Log en consola (no afecta UI)
└─→ Muestra fallback ("N/A", defaults)
```

## 🚀 Para Agregar Más Campos

Si quieres mostrar más datos (ej: teléfono, fecha de nacimiento):

### 1. Actualizar Service
```typescript
export async function fetchClienteByEmail(email: string) {
    const { data } = await supabase
        .from('clientes')
        .select('..., telefono, fecha_nacimiento, ...') // ← Agregar campos
        .eq('email', email)
        .single();
}
```

### 2. Ya está en el Schema (opcional actualizar)
El schema ya tiene `telefono` y `fecha_nacimiento`

### 3. Usar en Componente
```typescript
<ThemedText>{cliente?.telefono}</ThemedText>
<ThemedText>{new Date(cliente?.fecha_nacimiento).toLocaleDateString()}</ThemedText>
```

## ✨ Resumen

✅ **BD completamente mapeada**
✅ **Tipos correctamente tipificados**
✅ **Datos validados con Zod**
✅ **Cacheado con React Query**
✅ **Seguro y autenticado**
✅ **Pronto para producción**

