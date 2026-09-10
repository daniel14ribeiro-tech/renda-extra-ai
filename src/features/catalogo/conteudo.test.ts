import { describe, expect, it } from 'vitest';

import { carregarEntradasDoConteudo } from './conteudo';
import { calcularProximaRevisao, motivosParaNaoPublicar, podeSerPublicada } from './curadoria';

const entradas = await carregarEntradasDoConteudo();

/**
 * O carregador valida cada ficheiro contra o esquema e rebenta se algum falhar.
 * Estes testes verificam o que o esquema não consegue verificar sozinho: que as
 * entradas respeitam o processo de curadoria e que não afirmam o que não sabemos.
 */
describe('conteúdo do catálogo', () => {
  it('carrega as três primeiras entradas', () => {
    expect(entradas).toHaveLength(3);
  });

  it('cobre tipos deliberadamente diferentes', () => {
    const tipos = entradas.map((entrada) => entrada.tipo).sort();
    expect(tipos).toEqual(['t1', 't2', 't3']);
  });

  it('não afirma rendimento que não foi verificado', () => {
    for (const entrada of entradas) {
      expect(entrada.faixaRendimentoMensal, entrada.referencia).toBeNull();
    }
  });

  it('marca como pendente tudo o que exige verificação externa', () => {
    for (const entrada of entradas) {
      const campos = entrada.pendenciasVerificacao.map((p) => p.campo);

      expect(campos, entrada.referencia).toContain('faixa_rendimento_mensal');
      expect(campos, entrada.referencia).toContain('requisitos_legais');
      expect(campos, entrada.referencia).toContain('tempo_semanal_minimo_horas');
    }
  });

  it('não declara nenhum requisito legal como verificado', () => {
    for (const entrada of entradas) {
      expect(entrada.requisitosLegais.length, entrada.referencia).toBeGreaterThan(0);
      for (const requisito of entrada.requisitosLegais) {
        expect(requisito.estado, `${entrada.referencia}/${requisito.tema}`).toBe(
          'pendente_verificacao',
        );
      }
    }
  });

  it('mantém as entradas em rascunho, porque o processo não permite publicá-las', () => {
    for (const entrada of entradas) {
      expect(entrada.estado, entrada.referencia).toBe('rascunho');
      expect(podeSerPublicada(entrada), entrada.referencia).toBe(false);
      expect(motivosParaNaoPublicar(entrada).length, entrada.referencia).toBeGreaterThan(0);
    }
  });

  it('calcula a próxima revisão a partir da classe de volatilidade', () => {
    for (const entrada of entradas) {
      expect(entrada.dataProximaRevisao, entrada.referencia).toBe(
        calcularProximaRevisao(entrada.dataUltimaRevisao, entrada.classeVolatilidade),
      );
    }
  });

  it('concretiza os quatro níveis de validação, com evidência exigida em cada um', () => {
    for (const entrada of entradas) {
      for (const nivel of ['n1', 'n2', 'n3', 'n4'] as const) {
        const definicao = entrada.validacao[nivel];
        expect(definicao.descricao.length, `${entrada.referencia}/${nivel}`).toBeGreaterThan(0);
        expect(definicao.evidenciaExigida.length, `${entrada.referencia}/${nivel}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it('tem as três fases da escada de validação, por ordem e com tarefas', () => {
    for (const entrada of entradas) {
      expect(
        entrada.fases.map((f) => f.fase),
        entrada.referencia,
      ).toEqual(['preparacao', 'exposicao', 'conversao']);
      expect(
        entrada.fases.map((f) => f.nivelAlvo),
        entrada.referencia,
      ).toEqual(['n0', 'n1', 'n3']);

      for (const fase of entrada.fases) {
        expect(fase.tarefas.length, `${entrada.referencia}/${fase.fase}`).toBeGreaterThan(0);
        for (const tarefa of fase.tarefas) {
          expect(tarefa.criterioConclusao.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
