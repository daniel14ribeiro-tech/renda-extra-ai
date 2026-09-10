import { describe, expect, it, vi } from 'vitest';

import {
  fluxoDefinirPalavraPasse,
  fluxoEntrar,
  fluxoRecuperarAcesso,
  fluxoRegistar,
} from './fluxos';
import type { ResultadoAutenticacao, ServicoDeAutenticacao } from './tipos';

function servicoFalso(resposta: ResultadoAutenticacao = { estado: 'sucesso' }) {
  return {
    registar: vi.fn(() => Promise.resolve(resposta)),
    entrar: vi.fn(() => Promise.resolve(resposta)),
    sair: vi.fn(() => Promise.resolve(resposta)),
    pedirRecuperacaoDeAcesso: vi.fn(() => Promise.resolve(resposta)),
    definirNovaPalavraPasse: vi.fn(() => Promise.resolve(resposta)),
  } satisfies ServicoDeAutenticacao;
}

const PALAVRA_PASSE_VALIDA = 'uma-palavra-passe-longa';

describe('fluxoRegistar', () => {
  it('recusa email inválido sem chegar ao fornecedor', async () => {
    const servico = servicoFalso();
    const estado = await fluxoRegistar(servico, {
      email: 'nao-e-email',
      palavraPasse: PALAVRA_PASSE_VALIDA,
    });

    expect(estado.estado).toBe('erro');
    expect(servico.registar).not.toHaveBeenCalled();
  });

  it('recusa palavra-passe curta sem chegar ao fornecedor', async () => {
    const servico = servicoFalso();
    const estado = await fluxoRegistar(servico, { email: 'ana@exemplo.pt', palavraPasse: 'curta' });

    expect(estado.estado).toBe('erro');
    expect(servico.registar).not.toHaveBeenCalled();
  });

  it('pede confirmação por email quando o registo corre bem', async () => {
    const estado = await fluxoRegistar(servicoFalso({ estado: 'confirmacao_pendente' }), {
      email: 'ana@exemplo.pt',
      palavraPasse: PALAVRA_PASSE_VALIDA,
    });

    expect(estado).toMatchObject({ estado: 'aviso' });
  });
});

describe('fluxoEntrar', () => {
  it('propaga a falha de credenciais sem revelar qual o campo errado', async () => {
    const estado = await fluxoEntrar(
      servicoFalso({ estado: 'erro', mensagem: 'Email ou palavra-passe incorrectos.' }),
      {
        email: 'ana@exemplo.pt',
        palavraPasse: PALAVRA_PASSE_VALIDA,
      },
    );

    expect(estado).toEqual({ estado: 'erro', mensagem: 'Email ou palavra-passe incorrectos.' });
  });

  it('não impõe comprimento mínimo na entrada', async () => {
    const servico = servicoFalso();
    await fluxoEntrar(servico, { email: 'ana@exemplo.pt', palavraPasse: 'x' });

    expect(servico.entrar).toHaveBeenCalledWith('ana@exemplo.pt', 'x');
  });

  it('devolve sucesso quando as credenciais servem', async () => {
    const estado = await fluxoEntrar(servicoFalso(), {
      email: 'ana@exemplo.pt',
      palavraPasse: PALAVRA_PASSE_VALIDA,
    });

    expect(estado).toEqual({ estado: 'sucesso' });
  });
});

describe('fluxoRecuperarAcesso', () => {
  it('responde o mesmo quer a conta exista quer não', async () => {
    const comConta = await fluxoRecuperarAcesso(servicoFalso({ estado: 'confirmacao_pendente' }), {
      email: 'existe@exemplo.pt',
    });
    const semConta = await fluxoRecuperarAcesso(
      servicoFalso({ estado: 'erro', mensagem: 'user not found' }),
      { email: 'nao-existe@exemplo.pt' },
    );

    expect(comConta).toEqual(semConta);
    expect(comConta.estado).toBe('aviso');
  });
});

describe('fluxoDefinirPalavraPasse', () => {
  it('exige o comprimento mínimo', async () => {
    const servico = servicoFalso();
    const estado = await fluxoDefinirPalavraPasse(servico, { palavraPasse: 'curta' });

    expect(estado.estado).toBe('erro');
    expect(servico.definirNovaPalavraPasse).not.toHaveBeenCalled();
  });

  it('aceita uma palavra-passe suficientemente longa', async () => {
    const estado = await fluxoDefinirPalavraPasse(servicoFalso(), {
      palavraPasse: PALAVRA_PASSE_VALIDA,
    });

    expect(estado).toEqual({ estado: 'sucesso' });
  });
});
