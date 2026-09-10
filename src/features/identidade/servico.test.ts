import { describe, expect, it } from 'vitest';

import { exigirPapel, exigirUtilizador, obterUtilizadorAtual } from './servico';
import {
  ErroDeAutenticacao,
  ErroDeAutorizacao,
  type FonteDeSessao,
  type LeitorDePapeis,
  type Papel,
} from './tipos';

const UTILIZADOR = { id: 'aa000000-0000-0000-0000-000000000001', email: 'ana@exemplo.pt' };

function fonteCom(utilizador: typeof UTILIZADOR | null): FonteDeSessao {
  return { obterUtilizador: () => Promise.resolve(utilizador) };
}

function leitorCom(papeis: readonly Papel[]): LeitorDePapeis {
  return { papeisDe: () => Promise.resolve(papeis) };
}

describe('obterUtilizadorAtual', () => {
  it('devolve nulo sem sessão', async () => {
    await expect(obterUtilizadorAtual(fonteCom(null))).resolves.toBeNull();
  });

  it('devolve o utilizador com sessão', async () => {
    await expect(obterUtilizadorAtual(fonteCom(UTILIZADOR))).resolves.toEqual(UTILIZADOR);
  });
});

describe('exigirUtilizador', () => {
  it('recusa quando não há sessão', async () => {
    await expect(exigirUtilizador(fonteCom(null))).rejects.toBeInstanceOf(ErroDeAutenticacao);
  });

  it('deixa passar quem tem sessão', async () => {
    await expect(exigirUtilizador(fonteCom(UTILIZADOR))).resolves.toEqual(UTILIZADOR);
  });
});

describe('exigirPapel', () => {
  it('recusa quem não tem sessão, antes de olhar para papéis', async () => {
    await expect(
      exigirPapel(fonteCom(null), leitorCom(['administrador']), 'curador'),
    ).rejects.toBeInstanceOf(ErroDeAutenticacao);
  });

  it('recusa um utilizador comum a operação de curador', async () => {
    await expect(
      exigirPapel(fonteCom(UTILIZADOR), leitorCom([]), 'curador'),
    ).rejects.toBeInstanceOf(ErroDeAutorizacao);
  });

  it('deixa passar um curador', async () => {
    await expect(
      exigirPapel(fonteCom(UTILIZADOR), leitorCom(['curador']), 'curador'),
    ).resolves.toEqual(UTILIZADOR);
  });

  it('deixa passar um administrador em operação de curador', async () => {
    await expect(
      exigirPapel(fonteCom(UTILIZADOR), leitorCom(['administrador']), 'curador'),
    ).resolves.toEqual(UTILIZADOR);
  });
});
