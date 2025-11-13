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

export class AuthError extends AppError {
    constructor(message: string, code?: string) {
        super(message, code, 401);
        this.name = 'AuthError';
    }
}

/**
 * Mapeo de mensajes de error de Supabase a mensajes user-friendly
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    'Invalid login credentials': 'Código o contraseña incorrectos',
    'Invalid Refresh Token': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
    'Refresh Token Not Found': 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
    'Email not confirmed': 'Por favor, confirma tu email antes de iniciar sesión',
    'User already registered': 'Este usuario ya está registrado',
    'Invalid email': 'El formato del email no es válido',
};

/**
 * Obtener mensaje user-friendly para errores de autenticación
 */
export function getAuthErrorMessage(error: string): string {
    // Buscar coincidencia exacta
    if (AUTH_ERROR_MESSAGES[error]) {
        return AUTH_ERROR_MESSAGES[error];
    }

    // Buscar coincidencia parcial
    for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
        if (error.includes(key)) {
            return value;
        }
    }

    // Mensaje genérico
    return 'Error al procesar tu solicitud. Por favor, intenta nuevamente';
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

    // Errores de autenticación
    if (error instanceof AuthError) {
        return { message: error.message, code: error.code };
    }

    // Errores de aplicación
    if (error instanceof AppError) {
        return { message: error.message, code: error.code };
    }

    // Errores estándar
    if (error instanceof Error) {
        // Intentar obtener mensaje user-friendly para errores de auth
        const friendlyMessage = getAuthErrorMessage(error.message);
        return { message: friendlyMessage };
    }

    // Errores desconocidos
    return { message: 'Error desconocido' };
}

/**
 * Mostrar alerta de error al usuario
 */
export function showErrorAlert(error: unknown, title: string = 'Error') {
    const { message } = handleError(error);
    // Solo loguear en desarrollo
    if (__DEV__) {
        console.error(`[${title}]`, message);
    }
    Alert.alert(title, message);
}

/**
 * Logger centralizado (preparado para Sentry)
 */
export const logger = {
    error: (message: string, error?: unknown) => {
        if (__DEV__) {
            console.error(`[ERROR] ${message}`, error);
        }
        // TODO: Integrar Sentry aquí
        // Sentry.captureException(error, { extra: { message } });
    },
    warn: (message: string) => {
        if (__DEV__) {
            console.warn(`[WARN] ${message}`);
        }
    },
    info: (message: string) => {
        if (__DEV__) {
            console.info(`[INFO] ${message}`);
        }
    },
    debug: (message: string, data?: unknown) => {
        if (__DEV__) {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
};
