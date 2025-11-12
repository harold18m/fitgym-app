import { clienteSchema, type Cliente } from '@/types/cliente';
import { supabase } from '@/utils/supabase';

/**
 * Obtener cliente por email
 */
export async function fetchClienteByEmail(email: string): Promise<Cliente | null> {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('id, email, dni, avatar_url, estado, nombre_membresia, created_at')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error obteniendo cliente:', error.message);
            return null;
        }

        if (!data) return null;

        // Validar datos con Zod
        return clienteSchema.parse(data);
    } catch (error) {
        console.error('Error en fetchClienteByEmail:', error);
        return null;
    }
}

/**
 * Obtener cliente por ID
 */
export async function fetchClienteById(id: string): Promise<Cliente | null> {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error obteniendo cliente:', error.message);
            return null;
        }

        if (!data) return null;

        return clienteSchema.parse(data);
    } catch (error) {
        console.error('Error en fetchClienteById:', error);
        return null;
    }
}

/**
 * Actualizar cliente
 */
export async function updateCliente(
    id: string,
    updates: Partial<Omit<Cliente, 'id' | 'created_at'>>
): Promise<Cliente | null> {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error actualizando cliente:', error.message);
            return null;
        }

        return clienteSchema.parse(data);
    } catch (error) {
        console.error('Error en updateCliente:', error);
        return null;
    }
}
