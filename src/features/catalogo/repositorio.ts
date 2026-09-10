import { eq } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

import { executarComoUtilizador } from '@/lib/db/contexto';
import { entradasCatalogo, fasesCatalogo, tarefasCatalogo } from '@/lib/db/schema';

import type { EntradaCatalogo } from './esquema';

type Ligacao<TQuery extends PgQueryResultHKT> = PgDatabase<TQuery, Record<string, unknown>>;

export function criarRepositorioDeCatalogo<TQuery extends PgQueryResultHKT>(db: Ligacao<TQuery>) {
  return {
    /**
     * Grava uma entrada completa: cabeçalho, fases e tarefas, numa transacção.
     *
     * Corre no contexto de quem age, o que significa que quem não for curador é
     * recusado pela base de dados e não por uma verificação que alguém se possa
     * esquecer de escrever.
     */
    async guardar(actor: string, entrada: EntradaCatalogo): Promise<string> {
      return executarComoUtilizador(db, actor, async (tx) => {
        const [gravada] = await tx
          .insert(entradasCatalogo)
          .values({
            referencia: entrada.referencia,
            titulo: entrada.titulo,
            tipo: entrada.tipo,
            clienteAlvo: entrada.clienteAlvo,
            problema: entrada.problema,
            solucao: entrada.solucao,
            preRequisitos: entrada.preRequisitos,
            competencias: entrada.competencias,
            canaisTeste: entrada.canaisTeste,
            riscos: entrada.riscos,
            tempoSemanalMinimoHoras: entrada.tempoSemanalMinimoHoras,
            tempoNotas: entrada.tempoNotas,
            investimentoInicialNotas: entrada.investimentoInicialNotas,
            dificuldade: entrada.dificuldade,
            validacao: entrada.validacao,
            requisitosLegais: entrada.requisitosLegais,
            faixaRendimentoMensal: entrada.faixaRendimentoMensal,
            pendenciasVerificacao: entrada.pendenciasVerificacao,
            fontes: entrada.fontes,
            estado: entrada.estado,
            classeVolatilidade: entrada.classeVolatilidade,
            curador: entrada.curador,
            versao: entrada.versao,
            dataUltimaRevisao: entrada.dataUltimaRevisao,
            dataProximaRevisao: entrada.dataProximaRevisao,
          })
          .returning({ id: entradasCatalogo.id });

        if (!gravada) throw new Error('a entrada não foi gravada');

        for (const fase of entrada.fases) {
          const [faseGravada] = await tx
            .insert(fasesCatalogo)
            .values({
              entradaId: gravada.id,
              ordem: fase.ordem,
              fase: fase.fase,
              objetivo: fase.objetivo,
              nivelAlvo: fase.nivelAlvo,
            })
            .returning({ id: fasesCatalogo.id });

          if (!faseGravada) throw new Error('a fase não foi gravada');

          await tx.insert(tarefasCatalogo).values(
            fase.tarefas.map((tarefa) => ({
              faseId: faseGravada.id,
              ordem: tarefa.ordem,
              acao: tarefa.acao,
              criterioConclusao: tarefa.criterioConclusao,
              esforcoMinutos: tarefa.esforcoMinutos,
            })),
          );
        }

        return gravada.id;
      });
    },

    /** O que este utilizador consegue ver. A RLS decide, não um filtro no código. */
    async listarVisiveis(actor: string) {
      return executarComoUtilizador(db, actor, async (tx) =>
        tx
          .select({
            referencia: entradasCatalogo.referencia,
            titulo: entradasCatalogo.titulo,
            estado: entradasCatalogo.estado,
          })
          .from(entradasCatalogo),
      );
    },

    async contarTarefas(actor: string, entradaId: string): Promise<number> {
      return executarComoUtilizador(db, actor, async (tx) => {
        const linhas = await tx
          .select({ id: tarefasCatalogo.id })
          .from(tarefasCatalogo)
          .innerJoin(fasesCatalogo, eq(fasesCatalogo.id, tarefasCatalogo.faseId))
          .where(eq(fasesCatalogo.entradaId, entradaId));

        return linhas.length;
      });
    },
  };
}
