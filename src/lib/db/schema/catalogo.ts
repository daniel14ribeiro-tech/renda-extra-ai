import { sql } from 'drizzle-orm';
import {
  date,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUid, authenticatedRole } from 'drizzle-orm/supabase';

import {
  classeVolatilidade,
  estadoCuradoria,
  fasePlaybook,
  nivelDificuldade,
  nivelValidacao,
  tipoOportunidade,
} from './enums';

/** Quem pode escrever no catálogo. Curar é acto humano e privilegiado. */
const eCurador = sql`exists (
  select 1 from ${sql.identifier('papeis_utilizador')} p
  where p.utilizador_id = ${authUid} and p.papel in ('curador', 'administrador')
)`;

/**
 * O que um utilizador autenticado pode ler: apenas o que está publicado.
 * O alias é explícito — deixar a coluna por qualificar torna a política dependente
 * de resolução implícita de nomes, que se parte assim que uma tabela ganhar `estado`.
 */
const estaVisivel = (alias: string) =>
  sql`${sql.identifier(alias)}.estado in ('publicado', 'em_atualizacao')`;

/**
 * Entrada de catálogo — dados de referência curados por humanos.
 *
 * Não é dados de utilizador: não tem RLS por `user_id`, tem RLS por estado de curadoria.
 *
 * Campos que exigem verificação externa (faixas de rendimento, requisitos legais e
 * fiscais) ficam nulos ou marcados em `pendenciasVerificacao` até serem verificados
 * por um curador. Uma entrada nunca afirma procura, rendimento ou sucesso.
 */
export const entradasCatalogo = pgTable(
  'entradas_catalogo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    referencia: text('referencia').notNull().unique(),
    titulo: text('titulo').notNull(),
    tipo: tipoOportunidade('tipo').notNull(),

    clienteAlvo: text('cliente_alvo').notNull(),
    problema: text('problema').notNull(),
    solucao: text('solucao').notNull(),

    preRequisitos: jsonb('pre_requisitos').$type<string[]>().notNull().default([]),
    competencias: jsonb('competencias').$type<string[]>().notNull().default([]),
    canaisTeste: jsonb('canais_teste').$type<string[]>().notNull().default([]),
    riscos: jsonb('riscos').$type<string[]>().notNull().default([]),

    tempoSemanalMinimoHoras: integer('tempo_semanal_minimo_horas').notNull(),
    tempoNotas: text('tempo_notas'),
    investimentoInicialNotas: text('investimento_inicial_notas').notNull(),
    dificuldade: nivelDificuldade('dificuldade').notNull(),

    /** Definições de N1 a N4 concretizadas para esta entrada. */
    validacao: jsonb('validacao')
      .$type<Record<string, { descricao: string; evidenciaExigida: string[] }>>()
      .notNull(),

    /** Temas legais e fiscais a confirmar. Nunca afirmações jurídicas. */
    requisitosLegais: jsonb('requisitos_legais')
      .$type<{ tema: string; estado: string }[]>()
      .notNull()
      .default([]),

    /** Nulo enquanto não houver fonte verificada. Nunca preenchido por estimativa. */
    faixaRendimentoMensal: jsonb('faixa_rendimento_mensal').$type<{
      minimo: number;
      maximo: number;
      moeda: string;
      fonte: string;
      dataConsulta: string;
    } | null>(),

    /** Campos por verificar antes de a entrada poder ser publicada. */
    pendenciasVerificacao: jsonb('pendencias_verificacao')
      .$type<{ campo: string; motivo: string }[]>()
      .notNull()
      .default([]),

    fontes: jsonb('fontes')
      .$type<{ referencia: string; dataConsulta: string }[]>()
      .notNull()
      .default([]),

    estado: estadoCuradoria('estado').notNull().default('rascunho'),
    classeVolatilidade: classeVolatilidade('classe_volatilidade').notNull(),
    curador: text('curador').notNull(),
    versao: integer('versao').notNull().default(1),
    dataUltimaRevisao: date('data_ultima_revisao').notNull(),
    dataProximaRevisao: date('data_proxima_revisao').notNull(),
    motivoArquivo: text('motivo_arquivo'),

    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy('entradas_ler_publicadas', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${estaVisivel('entradas_catalogo')} or ${eCurador}`,
    }),
    pgPolicy('entradas_curador_escreve', {
      for: 'all',
      to: authenticatedRole,
      using: eCurador,
      withCheck: eCurador,
    }),
  ],
).enableRLS();

/** Fases do playbook base, ancoradas na escada de validação. */
export const fasesCatalogo = pgTable(
  'fases_catalogo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entradaId: uuid('entrada_id')
      .notNull()
      .references(() => entradasCatalogo.id, { onDelete: 'cascade' }),
    ordem: integer('ordem').notNull(),
    fase: fasePlaybook('fase').notNull(),
    objetivo: text('objetivo').notNull(),
    nivelAlvo: nivelValidacao('nivel_alvo').notNull(),
  },
  (t) => [
    unique('fases_catalogo_ordem_unica').on(t.entradaId, t.ordem),
    pgPolicy('fases_ler_publicadas', {
      for: 'select',
      to: authenticatedRole,
      using: sql`exists (
        select 1 from ${sql.identifier('entradas_catalogo')} e
        where e.id = entrada_id and ${estaVisivel('e')}
      ) or ${eCurador}`,
    }),
    pgPolicy('fases_curador_escreve', {
      for: 'all',
      to: authenticatedRole,
      using: eCurador,
      withCheck: eCurador,
    }),
  ],
).enableRLS();

/** Tarefas de cada fase, com critério de conclusão verificável. */
export const tarefasCatalogo = pgTable(
  'tarefas_catalogo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    faseId: uuid('fase_id')
      .notNull()
      .references(() => fasesCatalogo.id, { onDelete: 'cascade' }),
    ordem: integer('ordem').notNull(),
    acao: text('acao').notNull(),
    criterioConclusao: text('criterio_conclusao').notNull(),
    esforcoMinutos: integer('esforco_minutos').notNull(),
  },
  (t) => [
    unique('tarefas_catalogo_ordem_unica').on(t.faseId, t.ordem),
    pgPolicy('tarefas_ler_publicadas', {
      for: 'select',
      to: authenticatedRole,
      using: sql`exists (
        select 1 from ${sql.identifier('fases_catalogo')} f
        join ${sql.identifier('entradas_catalogo')} e on e.id = f.entrada_id
        where f.id = fase_id and ${estaVisivel('e')}
      ) or ${eCurador}`,
    }),
    pgPolicy('tarefas_curador_escreve', {
      for: 'all',
      to: authenticatedRole,
      using: eCurador,
      withCheck: eCurador,
    }),
  ],
).enableRLS();
