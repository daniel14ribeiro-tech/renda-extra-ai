import { pgEnum } from 'drizzle-orm/pg-core';

/** Papéis de utilizador, por ordem crescente de privilégio. */
export const papelUtilizador = pgEnum('papel_utilizador', [
  'utilizador',
  'curador',
  'administrador',
]);

/** Tipos de oportunidade. Determinam as regras de validação aplicáveis (T1–T6). */
export const tipoOportunidade = pgEnum('tipo_oportunidade', ['t1', 't2', 't3', 't4', 't5', 't6']);

/** Estados de uma entrada de catálogo. Ver docs/produto/processo-curadoria.md §2. */
export const estadoCuradoria = pgEnum('estado_curadoria', [
  'rascunho',
  'em_revisao',
  'publicado',
  'em_atualizacao',
  'arquivado',
]);

/** Classe de volatilidade: determina a cadência de revisão (90 / 180 / 365 dias). */
export const classeVolatilidade = pgEnum('classe_volatilidade', ['alta', 'media', 'baixa']);

export const nivelDificuldade = pgEnum('nivel_dificuldade', [
  'iniciante',
  'intermedio',
  'avancado',
]);

/** As três fases do plano, ancoradas na escada de validação. */
export const fasePlaybook = pgEnum('fase_playbook', ['preparacao', 'exposicao', 'conversao']);

/** Níveis da escada de validação. Ver docs/produto/definicoes-validacao.md. */
export const nivelValidacao = pgEnum('nivel_validacao', ['n0', 'n1', 'n2', 'n3', 'n4']);
