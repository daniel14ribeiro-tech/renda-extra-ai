import 'server-only';

import type { ResultadoAutenticacao, ServicoDeAutenticacao } from '@/features/identidade/tipos';
import { clientEnv } from '@/lib/env/client';

import { criarClienteServidor } from './clientes';

/**
 * Mensagem única para falhas de credenciais.
 *
 * Distinguir "esse email não existe" de "a palavra-passe está errada" entrega a
 * quem tenta uma lista de contas válidas. O utilizador legítimo perde pouco; quem
 * enumera contas perde tudo.
 */
const CREDENCIAIS_INVALIDAS = 'Email ou palavra-passe incorrectos.';

export function criarServicoDeAutenticacao(): ServicoDeAutenticacao {
  return {
    async registar(email, palavraPasse): Promise<ResultadoAutenticacao> {
      const supabase = await criarClienteServidor();
      const { error } = await supabase.auth.signUp({
        email,
        password: palavraPasse,
        options: { emailRedirectTo: `${clientEnv.NEXT_PUBLIC_APP_URL}/auth/confirmar` },
      });

      if (error) return { estado: 'erro', mensagem: 'Não foi possível criar a conta.' };
      return { estado: 'confirmacao_pendente' };
    },

    async entrar(email, palavraPasse): Promise<ResultadoAutenticacao> {
      const supabase = await criarClienteServidor();
      const { error } = await supabase.auth.signInWithPassword({ email, password: palavraPasse });

      if (error) return { estado: 'erro', mensagem: CREDENCIAIS_INVALIDAS };
      return { estado: 'sucesso' };
    },

    async sair(): Promise<ResultadoAutenticacao> {
      const supabase = await criarClienteServidor();
      const { error } = await supabase.auth.signOut();

      if (error) return { estado: 'erro', mensagem: 'Não foi possível terminar a sessão.' };
      return { estado: 'sucesso' };
    },

    async pedirRecuperacaoDeAcesso(email): Promise<ResultadoAutenticacao> {
      const supabase = await criarClienteServidor();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${clientEnv.NEXT_PUBLIC_APP_URL}/auth/confirmar?destino=/redefinir-palavra-passe`,
      });

      // Sempre o mesmo desfecho, exista a conta ou não: caso contrário este
      // formulário torna-se um verificador de emails registados.
      return { estado: 'confirmacao_pendente' };
    },

    async definirNovaPalavraPasse(palavraPasse): Promise<ResultadoAutenticacao> {
      const supabase = await criarClienteServidor();
      const { error } = await supabase.auth.updateUser({ password: palavraPasse });

      if (error) return { estado: 'erro', mensagem: 'Não foi possível definir a palavra-passe.' };
      return { estado: 'sucesso' };
    },
  };
}
