import { NextResponse, type NextRequest } from 'next/server';

import { decidirAcesso } from '@/features/identidade/rotas';
import { renovarSessao } from '@/lib/supabase/sessao-middleware';

/**
 * Renova a sessão e aplica a política de navegação.
 *
 * O middleware **não** é a segurança da aplicação: é conveniência de navegação.
 * Quem chegar a uma rota protegida encontra na mesma a verificação do lado do
 * servidor e a RLS. Confiar no middleware para proteger dados seria confiar numa
 * camada que não vê a base de dados.
 */
export async function middleware(pedido: NextRequest): Promise<NextResponse> {
  const { resposta, utilizador } = await renovarSessao(pedido);

  const decisao = decidirAcesso({
    caminho: pedido.nextUrl.pathname,
    temSessao: utilizador !== null,
  });

  if (decisao.accao === 'permitir') return resposta;

  const destino = new URL(decisao.destino, pedido.nextUrl.origin);
  const redireccionamento = NextResponse.redirect(destino);

  // Os cookies renovados têm de viajar com a resposta que é efectivamente
  // enviada, senão a renovação perde-se e a sessão cai de forma intermitente.
  resposta.cookies.getAll().forEach((cookie) => redireccionamento.cookies.set(cookie));

  return redireccionamento;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
