import { NextResponse, type NextRequest } from 'next/server';

import { confirmarLigacaoDeEmail } from '@/features/identidade/confirmacao';
import { destinoSeguro, ROTA_ENTRAR } from '@/features/identidade/rotas';

/**
 * Destino das ligações enviadas por email: confirmação de conta e recuperação
 * de acesso. Consome o token e inicia sessão antes de encaminhar.
 */
export async function GET(pedido: NextRequest): Promise<NextResponse> {
  const parametros = pedido.nextUrl.searchParams;

  const confirmado = await confirmarLigacaoDeEmail({
    tokenHash: parametros.get('token_hash'),
    tipo: parametros.get('type'),
  });

  const destino = confirmado
    ? destinoSeguro(parametros.get('destino'))
    : `${ROTA_ENTRAR}?erro=ligacao-invalida`;

  return NextResponse.redirect(new URL(destino, pedido.nextUrl.origin));
}
