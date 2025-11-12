import { logger } from '@/lib/errors';
import { fetchClienteByEmail, fetchClienteById, updateCliente } from '@/services/cliente.service';
import type { Cliente } from '@/types/cliente';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook para obtener cliente por email
 */
export function useClienteByEmail(email: string | null) {
    return useQuery({
        queryKey: ['cliente', email],
        queryFn: () => fetchClienteByEmail(email!),
        enabled: !!email,
        staleTime: 1000 * 60 * 10, // 10 minutos
    });
}

/**
 * Hook para obtener cliente por ID
 */
export function useClienteById(id: string | null) {
    return useQuery({
        queryKey: ['cliente', id],
        queryFn: () => fetchClienteById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Hook para actualizar cliente (mutation)
 */
export function useUpdateCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Cliente, 'id' | 'created_at'>> }) =>
            updateCliente(id, updates),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionados
            queryClient.invalidateQueries({
                queryKey: ['cliente', variables.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['cliente'],
            });
            logger.info('Cliente actualizado correctamente');
        },
        onError: (error) => {
            logger.error('Error al actualizar cliente', error);
        },
    });
}

/**
 * Hook para listar todos los clientes (cuando sea necesario)
 */
export function useClientes() {
    return useQuery({
        queryKey: ['clientes'],
        queryFn: async () => {
            // TODO: Implementar en cliente.service cuando sea necesario
            return [];
        },
    });
}
