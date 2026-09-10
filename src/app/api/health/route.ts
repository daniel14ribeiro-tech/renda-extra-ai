import { NextResponse } from 'next/server';

/**
 * Verificação de vida da aplicação, para monitorização e verificações pós-implantação.
 * Não expõe versões, dependências nem estado interno.
 */
export function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
