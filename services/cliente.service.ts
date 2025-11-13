import { clienteSchema, type Cliente } from '@/types/cliente';
import { supabase } from '@/utils/supabase';

/**
 * Obtener cliente por email con datos de membresía
 */
export async function fetchClienteByEmail(email: string): Promise<Cliente | null> {
    try {

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error('❌ No hay sesión activa:', sessionError?.message);
            return null;
        }

        const { data, error } = await supabase
            .from('clientes')
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
                ) as membresia
            `)
            .eq('email', email)
            .maybeSingle();

        console.log('📡 Datos RAW antes de validar:', JSON.stringify(data, null, 2));

        if (error) {
            console.error('❌ Error en consulta Supabase:', error.message, error.code);
            if (error.code === 'PGRST116') {
                console.error('🚫 Error de RLS: La tabla clientes no tiene permisos de lectura. Configura las políticas en Supabase.');
            }
            return null;
        }

        if (!data) {
            console.warn('⚠️ Cliente no encontrado con email:', email);
            return null;
        }

        // Validar datos con Zod
        try {
            const validated = clienteSchema.parse(data);
            console.log('✅ Datos validados con Zod:', JSON.stringify(validated, null, 2));
            return validated;
        } catch (validationError) {
            console.error('❌ Error de validación con Zod:', validationError);
            if (validationError instanceof Error) {
                console.error('Mensaje:', validationError.message);
            }
            return null;
        }
    } catch (error) {
        console.error('❌ Error en fetchClienteByEmail:', error);
        if (error instanceof Error) {
            console.error('Detalles del error:', error.message);
        }
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
