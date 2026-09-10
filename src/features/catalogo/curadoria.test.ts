import { describe, expect, it } from 'vitest';

import { calcularProximaRevisao, estadoAposPrazo, motivosParaNaoPublicar } from './curadoria';
import type { EntradaCatalogo } from './esquema';

const BASE = {
  pendenciasVerificacao: [],
  faixaRendimentoMensal: {
    minimo: 100,
    maximo: 400,
    moeda: 'EUR',
    fonte: 'inquérito interno',
    dataConsulta: '2026-09-01',
  },
  requisitosLegais: [{ tema: 'IVA', estado: 'verificado' }],
  fontes: [{ referencia: 'fonte', dataConsulta: '2026-09-01' }],
  curador: 'ana',
  classeVolatilidade: 'media',
  dataUltimaRevisao: '2026-09-10',
  dataProximaRevisao: '2027-03-09',
} as unknown as EntradaCatalogo;

describe('calcularProximaRevisao', () => {
  it('aplica a cadência de cada classe de volatilidade', () => {
    expect(calcularProximaRevisao('2026-09-10', 'alta')).toBe('2026-12-09');
    expect(calcularProximaRevisao('2026-09-10', 'media')).toBe('2027-03-09');
    expect(calcularProximaRevisao('2026-09-10', 'baixa')).toBe('2027-09-10');
  });
});

describe('motivosParaNaoPublicar', () => {
  it('não encontra motivos numa entrada completa', () => {
    expect(motivosParaNaoPublicar(BASE)).toEqual([]);
  });

  it('impede publicar sem faixa de rendimento verificada', () => {
    const semRendimento = { ...BASE, faixaRendimentoMensal: null };
    expect(motivosParaNaoPublicar(semRendimento).join(' ')).toContain('faixa de rendimento');
  });

  it('impede publicar com requisitos legais por confirmar', () => {
    const porConfirmar = {
      ...BASE,
      requisitosLegais: [{ tema: 'IVA', estado: 'pendente_verificacao' as const }],
    };
    expect(motivosParaNaoPublicar(porConfirmar).join(' ')).toContain('requisitos legais');
  });

  it('impede publicar com pendências por resolver', () => {
    const comPendencia = {
      ...BASE,
      pendenciasVerificacao: [{ campo: 'tempo', motivo: 'estimativa' }],
    };
    expect(motivosParaNaoPublicar(comPendencia).join(' ')).toContain('por verificar');
  });

  it('impede publicar sem curador atribuído', () => {
    const semCurador = { ...BASE, curador: 'por-atribuir' };
    expect(motivosParaNaoPublicar(semCurador).join(' ')).toContain('curador');
  });

  it('impede publicar com data de revisão fora da cadência', () => {
    const foraDeCadencia = { ...BASE, dataProximaRevisao: '2030-01-01' };
    expect(motivosParaNaoPublicar(foraDeCadencia).join(' ')).toContain('cadência');
  });
});

describe('estadoAposPrazo', () => {
  const publicada = { estado: 'publicado' as const, dataProximaRevisao: '2026-09-10' };

  it('mantém publicada uma entrada dentro do prazo', () => {
    expect(estadoAposPrazo(publicada, '2026-09-09')).toBe('publicado');
  });

  it('degrada para em_atualizacao depois do prazo', () => {
    expect(estadoAposPrazo(publicada, '2026-09-11')).toBe('em_atualizacao');
  });

  it('mantém em_atualizacao até ao último dia da tolerância', () => {
    // Prazo 2026-09-10 mais 90 dias de tolerância: o último dia é 2026-12-09.
    expect(estadoAposPrazo(publicada, '2026-12-09')).toBe('em_atualizacao');
  });

  it('arquiva depois de esgotada a tolerância', () => {
    expect(estadoAposPrazo(publicada, '2026-12-10')).toBe('arquivado');
  });

  it('não mexe em entradas que não estão publicadas', () => {
    expect(
      estadoAposPrazo({ estado: 'rascunho', dataProximaRevisao: '2020-01-01' }, '2026-09-10'),
    ).toBe('rascunho');
  });
});
