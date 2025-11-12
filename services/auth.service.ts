import { supabase } from '@/utils/supabase';

/**
 * Hacer login con email y password
 */
export async function login(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error en login:', message);
        return { success: false, error: message };
    }
}

/**
 * Cerrar sesión
 */
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error en logout:', message);
        return { success: false, error: message };
    }
}

/**
 * Obtener sesión actual
 */
export async function getSession() {
    try {
        const { data, error } = await supabase.auth.getSession();

        // Si hay error de refresh token, es normal si no está autenticado
        if (error) {
            // Errores de refresh token son esperados si no hay sesión
            if (error.message.includes('Refresh Token')) {
                return { success: true, data: { session: null } };
            }
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        // No mostrar error de refresh token en logs
        if (!message.includes('Refresh Token')) {
            console.error('Error en getSession:', message);
        }
        return { success: true, data: { session: null } };
    }
}

/**
 * Obtener usuario actual
 */
export async function getUser() {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error en getUser:', message);
        return { success: false, error: message };
    }
}

/**
 * Escuchar cambios en el estado de autenticación
 */
export function onAuthStateChange(
    callback: (event: string, session: any) => void
) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}
