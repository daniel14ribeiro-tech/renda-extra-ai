import { describe, expect, it } from 'vitest';

import { papeisEfectivos, podeCurarCatalogo, temPeloMenos } from './autorizacao';

describe('temPeloMenos', () => {
  it('aceita o papel exacto', () => {
    expect(temPeloMenos(['curador'], 'curador')).toBe(true);
  });

  it('aceita um papel superior', () => {
    expect(temPeloMenos(['administrador'], 'curador')).toBe(true);
  });

  it('recusa um papel inferior', () => {
    expect(temPeloMenos(['utilizador'], 'curador')).toBe(false);
  });

  it('recusa quando não há papéis', () => {
    expect(temPeloMenos([], 'utilizador')).toBe(false);
  });

  it('aceita quando um de vários papéis chega', () => {
    expect(temPeloMenos(['utilizador', 'administrador'], 'curador')).toBe(true);
  });
});

describe('podeCurarCatalogo', () => {
  it('recusa um utilizador comum', () => {
    expect(podeCurarCatalogo(['utilizador'])).toBe(false);
  });

  it('aceita curador e administrador', () => {
    expect(podeCurarCatalogo(['curador'])).toBe(true);
    expect(podeCurarCatalogo(['administrador'])).toBe(true);
  });
});

describe('papeisEfectivos', () => {
  it('acrescenta o papel base a quem não o tem atribuído', () => {
    expect(papeisEfectivos(['curador'])).toEqual(['utilizador', 'curador']);
  });

  it('não duplica o papel base', () => {
    expect(papeisEfectivos(['utilizador'])).toEqual(['utilizador']);
  });
});
