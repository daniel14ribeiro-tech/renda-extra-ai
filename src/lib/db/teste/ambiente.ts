import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from '../schema';

const DIRECTORIO_MIGRACOES = path.join(process.cwd(), 'src/lib/db/migrations');

interface EntradaJornal {
  readonly tag: string;
  readonly idx: number;
}

/**
 * Lê o jornal de migrações e devolve as tags por ordem de aplicação.
 * Aplicar as migrações a partir do jornal é o que torna os testes uma auditoria
 * real: se uma migração não correr, os testes não correm.
 */
export async function lerJornalDeMigracoes(): Promise<readonly string[]> {
  const bruto = await readFile(path.join(DIRECTORIO_MIGRACOES, 'meta/_journal.json'), 'utf8');
  const jornal = JSON.parse(bruto) as { entries: EntradaJornal[] };

  return [...jornal.entries].sort((a, b) => a.idx - b.idx).map((entrada) => entrada.tag);
}

/**
 * Recria as partes do Supabase de que o esquema depende.
 *
 * Não é uma imitação do Supabase: é a superfície mínima contra a qual as nossas
 * migrações são escritas — os papéis `anon` e `authenticated`, a tabela `auth.users`
 * a que as chaves estrangeiras apontam, e `auth.uid()` com a mesma implementação
 * que o Supabase usa (lê o `sub` das claims do JWT declaradas na sessão).
 */
async function prepararSuperficieSupabase(pg: PGlite): Promise<void> {
  await pg.exec(`
    create role anon nologin noinherit;
    create role authenticated nologin noinherit;
    create schema if not exists auth;
    create table auth.users (
      id uuid primary key,
      email text unique not null
    );
    create or replace function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid
    $$;
    grant usage on schema auth to anon, authenticated;
  `);
}

async function aplicarMigracoes(pg: PGlite): Promise<readonly string[]> {
  const tags = await lerJornalDeMigracoes();

  for (const tag of tags) {
    const sql = await readFile(path.join(DIRECTORIO_MIGRACOES, `${tag}.sql`), 'utf8');

    for (const instrucao of sql.split('--> statement-breakpoint')) {
      const limpa = instrucao.trim();
      if (limpa.length > 0) await pg.exec(limpa);
    }
  }

  return tags;
}

export interface AmbienteDeTeste {
  readonly pg: PGlite;
  readonly db: ReturnType<typeof drizzle<typeof schema>>;
  readonly migracoesAplicadas: readonly string[];
  /** Cria um utilizador em auth.users e devolve o seu id. */
  criarUtilizador(email: string): Promise<string>;
  /** Atribui um papel, como faria o código de administração com a chave de serviço. */
  atribuirPapel(utilizadorId: string, papel: 'curador' | 'administrador'): Promise<void>;
  fechar(): Promise<void>;
}

/**
 * Levanta um Postgres real em memória com o esquema aplicado a partir das migrações.
 * Sem imitações: as políticas de RLS que correm aqui são as que vão para produção.
 */
export async function criarAmbienteDeTeste(): Promise<AmbienteDeTeste> {
  const pg = await PGlite.create();
  await prepararSuperficieSupabase(pg);
  const migracoesAplicadas = await aplicarMigracoes(pg);
  const db = drizzle({ client: pg, schema });

  return {
    pg,
    db,
    migracoesAplicadas,

    async criarUtilizador(email) {
      const resultado = await pg.query<{ id: string }>(
        'insert into auth.users (id, email) values (gen_random_uuid(), $1) returning id',
        [email],
      );
      const linha = resultado.rows[0];
      if (!linha) throw new Error(`não foi possível criar o utilizador ${email}`);
      return linha.id;
    },

    async atribuirPapel(utilizadorId, papel) {
      await pg.query('insert into papeis_utilizador (utilizador_id, papel) values ($1, $2)', [
        utilizadorId,
        papel,
      ]);
    },

    async fechar() {
      await pg.close();
    },
  };
}
