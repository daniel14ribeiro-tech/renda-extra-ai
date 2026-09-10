import { z } from 'zod';

/** Tipos de oportunidade. Determinam as regras de validação. Ver definicoes-validacao.md. */
export const TIPOS = ['t1', 't2', 't3', 't4', 't5', 't6'] as const;

export const ESTADOS = [
  'rascunho',
  'em_revisao',
  'publicado',
  'em_atualizacao',
  'arquivado',
] as const;

const data = z.iso.date();

const nivelDeValidacao = z.object({
  descricao: z.string().min(1),
  evidenciaExigida: z.array(z.string().min(1)).min(1),
});

/**
 * Uma pendência é uma afirmação por verificar.
 *
 * Existe para que um campo que precisa de confirmação externa — enquadramento
 * legal, valores de mercado, estimativas de esforço — seja registado como tal em
 * vez de ser preenchido a martelo com um número plausível. Um número inventado
 * é indistinguível de um número apurado depois de estar na base de dados.
 */
const pendencia = z.object({
  campo: z.string().min(1),
  motivo: z.string().min(1),
});

const fonte = z.object({
  referencia: z.string().min(1),
  dataConsulta: data,
});

export const esquemaTarefa = z.object({
  ordem: z.number().int().positive(),
  acao: z.string().min(1),
  criterioConclusao: z.string().min(1),
  esforcoMinutos: z.number().int().positive(),
});

export const esquemaFase = z.object({
  ordem: z.number().int().positive(),
  fase: z.enum(['preparacao', 'exposicao', 'conversao']),
  objetivo: z.string().min(1),
  nivelAlvo: z.enum(['n0', 'n1', 'n2', 'n3', 'n4']),
  tarefas: z.array(esquemaTarefa).min(1),
});

export const esquemaEntradaCatalogo = z.object({
  referencia: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'A referência usa apenas minúsculas, dígitos e hífenes.'),
  titulo: z.string().min(1),
  tipo: z.enum(TIPOS),

  clienteAlvo: z.string().min(1),
  problema: z.string().min(1),
  solucao: z.string().min(1),

  preRequisitos: z.array(z.string().min(1)),
  competencias: z.array(z.string().min(1)).min(1),
  canaisTeste: z.array(z.string().min(1)).min(1),
  riscos: z.array(z.string().min(1)).min(1),

  tempoSemanalMinimoHoras: z.number().int().positive(),
  tempoNotas: z.string().nullable(),
  investimentoInicialNotas: z.string().min(1),
  dificuldade: z.enum(['iniciante', 'intermedio', 'avancado']),

  /** Os quatro níveis são obrigatórios: uma entrada sem escada não é executável. */
  validacao: z.object({
    n1: nivelDeValidacao,
    n2: nivelDeValidacao,
    n3: nivelDeValidacao,
    n4: nivelDeValidacao,
  }),

  /** Temas a confirmar. Nunca afirmações jurídicas ou fiscais. */
  requisitosLegais: z
    .array(z.object({ tema: z.string().min(1), estado: z.literal('pendente_verificacao') }))
    .min(1),

  /** Nulo até haver fonte verificada. Não se estima rendimento. */
  faixaRendimentoMensal: z
    .object({
      minimo: z.number().nonnegative(),
      maximo: z.number().nonnegative(),
      moeda: z.string().min(1),
      fonte: z.string().min(1),
      dataConsulta: data,
    })
    .nullable(),

  pendenciasVerificacao: z.array(pendencia),
  fontes: z.array(fonte),

  estado: z.enum(ESTADOS),
  classeVolatilidade: z.enum(['alta', 'media', 'baixa']),
  curador: z.string().min(1),
  versao: z.number().int().positive(),
  dataUltimaRevisao: data,
  dataProximaRevisao: data,

  fases: z.array(esquemaFase).length(3),
});

export type EntradaCatalogo = z.infer<typeof esquemaEntradaCatalogo>;
