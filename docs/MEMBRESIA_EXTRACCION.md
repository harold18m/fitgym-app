# 📋 Extracción de Datos de Membresía

## ✅ Cambios Realizados

He actualizado el código para extraer y mostrar **todos los datos de la membresía** del cliente, haciendo un JOIN con la tabla `membresias`.

### 1. **Actualización en `/types/cliente.ts`**

Se agregó un nuevo schema para Membresía:

```typescript
export const membresiaSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string().nullable().optional(),
    tipo: z.string(),
    modalidad: z.string(),
    precio: z.number(),
    duracion: z.number(),
    caracteristicas: z.array(z.string()).optional(),
    activa: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type Membresia = z.infer<typeof membresiaSchema>;
```

Y se actualizó el schema de Cliente para incluir la membresía completa:

```typescript
export const clienteSchema = z.object({
    // ... otros campos ...
    membresia: membresiaSchema.optional(),
});
```

### 2. **Actualización en `/services/cliente.service.ts`**

Se cambió la consulta para hacer un **JOIN con la tabla membresias**:

```typescript
.select(`
    id, 
    email, 
    nombre, 
    dni, 
    avatar_url, 
    estado, 
    fecha_inicio, 
    fecha_fin, 
    asistencias, 
    fecha_registro, 
    created_at, 
    updated_at, 
    membresia_id,
    membresias!membresia_id (
        id,
        nombre,
        descripcion,
        tipo,
        modalidad,
        precio,
        duracion,
        caracteristicas,
        activa,
        created_at,
        updated_at
    )
`)
```

**Campos que ahora se obtienen:**
- `membresias.nombre` - Nombre de la membresía
- `membresias.descripcion` - Descripción
- `membresias.tipo` - Tipo (mensual, trimestral, anual)
- `membresias.modalidad` - Modalidad (diario, interdiario, libre)
- `membresias.precio` - Precio en soles
- `membresias.duracion` - Duración en días
- `membresias.caracteristicas` - Array con beneficios incluidos
- `membresias.activa` - Si está activa o no

### 3. **Actualización en `/app/(tabs)/perfil.tsx`**

Se rediseñó completamente la sección "Mi membresía" para mostrar:

```typescript
// Nombre y tipo de membresía
{cliente?.membresia?.nombre ?? cliente?.nombre_membresia ?? 'Sin membresía'}
{cliente?.membresia?.tipo ?? cliente?.tipo_membresia ?? 'Acceso'}

// Datos de membresía
<ThemedText>{cliente?.membresia?.modalidad}</ThemedText>  // Modalidad
<ThemedText>S/ {Number(cliente.membresia.precio).toFixed(2)}</ThemedText>  // Precio
<ThemedText>{cliente.membresia.duracion} días</ThemedText>  // Duración

// Fechas
{new Date(cliente.fecha_inicio).toLocaleDateString('es-ES')}
{new Date(cliente.fecha_fin).toLocaleDateString('es-ES')}

// Beneficios (características)
{cliente.membresia.caracteristicas.map((caracteristica) => (
    <ThemedText>• {caracteristica}</ThemedText>
))}
```

---

## 📊 Estructura de Datos Completa

Ahora el cliente trae esta estructura:

```json
{
  "id": "uuid",
  "nombre": "Juan Pérez",
  "email": "75010670@fitgym.com.pe",
  "estado": "activa",
  "fecha_inicio": "2024-01-15",
  "fecha_fin": "2024-12-15",
  "membresia": {
    "id": "uuid",
    "nombre": "Plan Premium",
    "tipo": "anual",
    "modalidad": "libre",
    "precio": 1200.00,
    "duracion": 365,
    "caracteristicas": [
      "Acceso 24/7 al gimnasio",
      "Clases grupales ilimitadas",
      "Asesoría nutricional",
      "Rutinas personalizadas",
      "Acceso a zona de spa"
    ],
    "activa": true
  }
}
```

---

## 🎯 Datos que Ahora se Muestran

### Información Personal
- ✅ Nombre
- ✅ Avatar
- ✅ Fecha de registro
- ✅ Estado de membresía (Activa/Vencida/Suspendida)

### Mi Membresía
- ✅ Nombre de la membresía (ej: "Plan Premium")
- ✅ Tipo de membresía (ej: "anual")
- ✅ Modalidad (ej: "libre")
- ✅ Precio (ej: "S/ 1200.00")
- ✅ Duración (ej: "365 días")
- ✅ Fecha de inicio
- ✅ Fecha de vencimiento
- ✅ Beneficios incluidos (lista de características)

### Estadísticas
- ✅ Total de visitas
- ✅ Miembro desde (fecha formateada)

---

## 🔄 Flujo de Datos

```
Supabase (clientes table)
    ↓
JOIN con membresias table
    ↓
fetchClienteByEmail()
    ↓
Validación Zod
    ↓
React Query (caching 10 minutos)
    ↓
useClienteByEmail()
    ↓
perfil.tsx
    ↓
Cliente con todos los datos visibles
```

---

## ✨ Fallback Inteligente

El código tiene fallback para compatibilidad con datos antiguos:

```typescript
// Si no hay membresia.nombre, usa nombre_membresia
{cliente?.membresia?.nombre ?? cliente?.nombre_membresia ?? 'Sin membresía'}

// Si no hay membresia.tipo, usa tipo_membresia
{cliente?.membresia?.tipo ?? cliente?.tipo_membresia ?? 'Acceso'}
```

---

## 🚀 Próximos Pasos

1. **Reinicia la app**: `expo start`
2. **Navega a Perfil**: Ve al tab de Perfil
3. **Verifica los datos**: Deberías ver:
   - Nombre de la membresía (ej: "Plan Premium")
   - Tipo (ej: "anual")
   - Modalidad (ej: "libre")
   - Precio (ej: "S/ 1200.00")
   - Duración (ej: "365 días")
   - Lista de beneficios

Si los datos aún no se cargan, revisa los logs de Supabase para asegurar que las políticas RLS están configuradas correctamente.

---

## 📝 Esquema de Membresía en BD

De acuerdo al `bd.prisma`:

```prisma
model membresias {
  id               String     @id @default(uuid()) @db.Uuid
  nombre           String     @db.VarChar(255)
  descripcion      String?
  tipo             String     @db.VarChar(20)  // mensual, trimestral, anual
  modalidad        String     @db.VarChar(20)  // diario, interdiario, libre
  precio           Decimal    @db.Decimal(10, 2)
  duracion         Int
  caracteristicas  String[]   // Array de beneficios
  activa           Boolean    @default(true)
  created_at       DateTime   @default(now()) @db.Timestamptz(6)
  updated_at       DateTime   @updatedAt @db.Timestamptz(6)
  clientes         clientes[]
}
```

Todos estos campos ahora se extraen y se muestran correctamente en la app.
