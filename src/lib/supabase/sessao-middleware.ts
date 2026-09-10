import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { clientEnv } from '@/lib/env/client';

/**
 * Renova a sessão em cada pedido e devolve o utilizador validado.
 *
 * Corre no middleware porque é o único sítio onde se pode escrever cookies antes de
 * a página renderizar. A resposta devolvida transporta os cookies renovados e tem de
 * ser a resposta efectivamente enviada — criar outra perde a renovação e o
 * utilizador é atirado para fora da sessão de forma intermitente.
 */
export async function renovarSessao(pedido: NextRequest) {
  let resposta = NextResponse.next({ request: pedido });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => pedido.cookies.getAll(),
        setAll: (paraDefinir) => {
          paraDefinir.forEach(({ name, value }) => pedido.cookies.set(name, value));
          resposta = NextResponse.next({ request: pedido });
          paraDefinir.forEach(({ name, value, options }) =>
            resposta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();

  return { resposta, utilizador: data.user };
}
