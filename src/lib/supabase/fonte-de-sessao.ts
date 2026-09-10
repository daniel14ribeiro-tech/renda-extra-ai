import 'server-only';

import type { FonteDeSessao, UtilizadorAutenticado } from '@/features/identidade/tipos';

import { criarClienteServidor } from './clientes';

/**
 * Adaptador: implementa a porta de sessão do domínio sobre o Supabase.
 *
 * Usa `getUser()` e nunca `getSession()`: `getSession` lê o que está no cookie e
 * acredita nele, enquanto `getUser` valida o token junto do servidor de autenticação.
 * Num Server Component, confiar no cookie é confiar no cliente.
 */
export function criarFonteDeSessao(): FonteDeSessao {
  return {
    async obterUtilizador(): Promise<UtilizadorAutenticado | null> {
      const supabase = await criarClienteServidor();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user?.email) return null;
      return { id: data.user.id, email: data.user.email };
    },
  };
}
