import { eq } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

import { executarComoUtilizador } from '@/lib/db/contexto';
import { papeisUtilizador, perfis } from '@/lib/db/schema';

import { type Papel, type Perfil } from './tipos';

type Ligacao<TQuery extends PgQueryResultHKT> = PgDatabase<TQuery, Record<string, unknown>>;

/**
 * Acesso a dados de identidade.
 *
 * Todas as operações correm dentro do contexto do utilizador em causa, o que
 * significa que a RLS é avaliada em cada uma. O `utilizadorId` recebido é quem
 * está a agir — não é um filtro de conveniência que se possa esquecer: mesmo que
 * uma consulta pedisse a linha de outra pessoa, a base de dados não a devolve.
 */
export function criarRepositorioDeIdentidade<TQuery extends PgQueryResultHKT>(db: Ligacao<TQuery>) {
  return {
    async obterPerfil(actor: string, alvo: string = actor): Promise<Perfil | null> {
      return executarComoUtilizador(db, actor, async (tx) => {
        const linhas = await tx
          .select({ id: perfis.id, nomeApresentacao: perfis.nomeApresentacao })
          .from(perfis)
          .where(eq(perfis.id, alvo));

        return linhas[0] ?? null;
      });
    },

    async criarPerfil(actor: string, nomeApresentacao: string | null): Promise<void> {
      await executarComoUtilizador(db, actor, async (tx) => {
        await tx.insert(perfis).values({ id: actor, nomeApresentacao });
      });
    },

    /** Devolve quantas linhas foram efectivamente alteradas — zero é a prova de recusa. */
    async actualizarNome(actor: string, alvo: string, nome: string): Promise<number> {
      return executarComoUtilizador(db, actor, async (tx) => {
        const alteradas = await tx
          .update(perfis)
          .set({ nomeApresentacao: nome, atualizadoEm: new Date() })
          .where(eq(perfis.id, alvo))
          .returning({ id: perfis.id });

        return alteradas.length;
      });
    },

    async papeisDe(actor: string, alvo: string = actor): Promise<readonly Papel[]> {
      return executarComoUtilizador(db, actor, async (tx) => {
        const linhas = await tx
          .select({ papel: papeisUtilizador.papel })
          .from(papeisUtilizador)
          .where(eq(papeisUtilizador.utilizadorId, alvo));

        return linhas.map((linha) => linha.papel);
      });
    },
  };
}

export type RepositorioDeIdentidade = ReturnType<typeof criarRepositorioDeIdentidade>;
