import { z } from 'zod';

// Esquema para datos de membresía
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

// Esquema de validación para Cliente
export const clienteSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    email: z.string(),
    telefono: z.string().optional(),
    dni: z.string().optional(),
    fecha_nacimiento: z.string().optional(),
    fecha_registro: z.string().optional(),
    membresia_id: z.string().optional(),
    membresias: membresiaSchema.optional(),
    asistencias: z.number().optional(),
    fecha_inicio: z.string().optional(),
    fecha_fin: z.string().optional(),
    estado: z.enum(['activa', 'vencida', 'suspendida']).optional(),
    avatar_url: z.string().optional(),
    asistencias_count: z.number().optional(),
    deleted_at: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Tipo TypeScript inferido de Zod
export type Cliente = z.infer<typeof clienteSchema>;

// Esquema para crear/actualizar cliente
export const createClienteSchema = clienteSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});

export type CreateClienteData = z.infer<typeof createClienteSchema>;
