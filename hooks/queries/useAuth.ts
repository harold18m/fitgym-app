import { logger } from '@/lib/errors';
import { login as authServiceLogin } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';

/**
 * Hook para login
 */
export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authServiceLogin(email, password),
        onSuccess: () => {
            logger.info('Login exitoso');
        },
        onError: (error) => {
            logger.error('Error en login', error);
        },
    });
}
