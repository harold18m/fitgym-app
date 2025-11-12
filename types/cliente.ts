import { z } from 'zod';

// Esquema de validación para Cliente
export const clienteSchema = z.object({
    id: z.string(),
    email: z.email(),
    dni: z.string().optional(),
    avatar_url: z.string().optional(),
    estado: z.enum(['activo', 'inactivo']).optional(),
    nombre_membresia: z.string().optional(),
    created_at: z.string().optional(),
});

// Tipo TypeScript inferido de Zod
export type Cliente = z.infer<typeof clienteSchema>;

// Esquema para crear/actualizar cliente
export const createClienteSchema = clienteSchema.omit({
    id: true,
    created_at: true,
});

export type CreateClienteData = z.infer<typeof createClienteSchema>;
