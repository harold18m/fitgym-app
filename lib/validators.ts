import { z } from 'zod';

/**
 * Esquemas de validación centralizados para formularios
 */

// Login form
export const loginFormSchema = z.object({
    codigo: z.string()
        .min(2, 'Código requerido')
        .max(20, 'Código muy largo'),
    password: z.string()
        .min(6, 'Mínimo 6 caracteres')
        .max(50, 'Contraseña muy larga'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Editar perfil
export const editProfileSchema = z.object({
    email: z.string().email('Email inválido').optional(),
    nombre: z.string().min(2, 'Nombre muy corto').optional(),
    avatar_url: z.string().url('URL inválida').optional(),
});

export type EditProfileData = z.infer<typeof editProfileSchema>;

// Crear ejercicio
export const createExerciseSchema = z.object({
    name: z.string().min(3, 'Nombre del ejercicio requerido'),
    sets: z.number().min(1).max(10),
    reps: z.string().min(1),
    weight: z.string().optional(),
    muscle: z.string().min(2),
});

export type CreateExerciseData = z.infer<typeof createExerciseSchema>;
