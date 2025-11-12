import { Alert } from 'react-native';
import { z } from 'zod';

/**
 * Sistema centralizado de manejo de errores
 */

export class AppError extends Error {
    constructor(
        public message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Clasificar y manejar diferentes tipos de errores
 */
export function handleError(error: unknown): { message: string; code?: string } {
    // Errores de validación Zod
    if (error instanceof z.ZodError) {
        const messages = error.issues.map((e: any) => e.message).join(', ');
        return { message: `Validación: ${messages}` };
    }

    // Errores de aplicación
    if (error instanceof AppError) {
        return { message: error.message, code: error.code };
    }

    // Errores estándar
    if (error instanceof Error) {
        return { message: error.message };
    }

    // Errores desconocidos
    return { message: 'Error desconocido' };
}

/**
 * Mostrar alerta de error al usuario
 */
export function showErrorAlert(error: unknown, title: string = 'Error') {
    const { message } = handleError(error);
    console.error(`[${title}]`, message);
    Alert.alert(title, message);
}

/**
 * Logger centralizado (preparado para Sentry)
 */
export const logger = {
    error: (message: string, error?: unknown) => {
        console.error(`[ERROR] ${message}`, error);
        // TODO: Integrar Sentry aquí
    },
    warn: (message: string) => {
        console.warn(`[WARN] ${message}`);
    },
    info: (message: string) => {
        console.log(`[INFO] ${message}`);
    },
    debug: (message: string, data?: unknown) => {
        if (__DEV__) {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
};
