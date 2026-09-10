import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { serverEnv } from '@/lib/env/server';

import * as schema from './schema';

/**
 * Ligação partilhada ao Postgres.
 *
 * Guardada num global porque o recarregamento a quente em desenvolvimento reavalia
 * os módulos e abriria uma ligação nova a cada alteração até esgotar o servidor.
 *
 * Esta ligação é feita com um papel privilegiado: por si só, ignora a RLS. Todo o
 * acesso a dados de utilizador tem de passar por `executarComoUtilizador`, que
 * desce ao papel `authenticated` dentro da transacção.
 */
const cache = globalThis as unknown as {
  ligacaoRendaExtra?: ReturnType<typeof criar>;
};

function criar() {
  const cliente = postgres(serverEnv.DATABASE_URL, { prepare: false });
  return drizzle({ client: cliente, schema });
}

export function obterBaseDeDados() {
  cache.ligacaoRendaExtra ??= criar();
  return cache.ligacaoRendaExtra;
}
