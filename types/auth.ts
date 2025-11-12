import { z } from 'zod';

// Esquema de validación para Login
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginData = z.infer<typeof loginSchema>;

// Esquema para respuesta de autenticación
export const authResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string().email(),
    }).optional(),
    session: z.object({
        access_token: z.string(),
        refresh_token: z.string().optional(),
    }).optional(),
    error: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
