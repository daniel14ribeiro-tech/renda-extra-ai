import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { clientEnv } from '@/lib/env/client';

/**
 * Cliente para o navegador.
 *
 * Usa a chave anónima, que é pública por desenho — vai embutida no pacote enviado
 * ao cliente. Quem protege os dados é a RLS, não o segredo desta chave.
 */
export function criarClienteNavegador() {
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente para Server Components, route handlers e acções do servidor.
 *
 * Um Server Component não pode escrever cookies; nesse caso a escrita é ignorada e
 * a renovação da sessão fica a cargo do middleware, que corre antes.
 */
export async function criarClienteServidor() {
  const armazem = await cookies();

  return createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => armazem.getAll(),
        setAll: (paraDefinir) => {
          try {
            paraDefinir.forEach(({ name, value, options }) => armazem.set(name, value, options));
          } catch {
            // Server Component: sem acesso de escrita. O middleware trata da renovação.
          }
        },
      },
    },
  );
}
