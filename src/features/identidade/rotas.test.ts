import { describe, expect, it } from 'vitest';

import { decidirAcesso, destinoSeguro, ROTA_CONTA } from './rotas';

describe('decidirAcesso', () => {
  it('manda para a entrada quem tenta uma rota protegida sem sessão', () => {
    expect(decidirAcesso({ caminho: '/conta', temSessao: false })).toEqual({
      accao: 'redireccionar',
      destino: '/entrar?regressar=%2Fconta',
    });
  });

  it('protege também as sub-rotas', () => {
    expect(decidirAcesso({ caminho: '/conta/definicoes', temSessao: false }).accao).toBe(
      'redireccionar',
    );
  });

  it('deixa passar quem tem sessão numa rota protegida', () => {
    expect(decidirAcesso({ caminho: '/conta', temSessao: true })).toEqual({ accao: 'permitir' });
  });

  it('afasta de quem já tem sessão as páginas de entrada e registo', () => {
    for (const caminho of ['/entrar', '/registar', '/recuperar-acesso']) {
      expect(decidirAcesso({ caminho, temSessao: true })).toEqual({
        accao: 'redireccionar',
        destino: ROTA_CONTA,
      });
    }
  });

  it('exige sessão para redefinir a palavra-passe', () => {
    expect(decidirAcesso({ caminho: '/redefinir-palavra-passe', temSessao: false }).accao).toBe(
      'redireccionar',
    );
    expect(decidirAcesso({ caminho: '/redefinir-palavra-passe', temSessao: true }).accao).toBe(
      'permitir',
    );
  });

  it('não interfere com rotas públicas', () => {
    expect(decidirAcesso({ caminho: '/', temSessao: false })).toEqual({ accao: 'permitir' });
  });

  it('não confunde um prefixo com a rota protegida', () => {
    expect(decidirAcesso({ caminho: '/contabilidade', temSessao: false })).toEqual({
      accao: 'permitir',
    });
  });
});

describe('destinoSeguro', () => {
  it('aceita um caminho interno', () => {
    expect(destinoSeguro('/conta/definicoes')).toBe('/conta/definicoes');
  });

  it('recusa um destino absoluto noutro domínio', () => {
    expect(destinoSeguro('https://sitio-falso.exemplo')).toBe(ROTA_CONTA);
  });

  it('recusa a forma abreviada de destino externo', () => {
    expect(destinoSeguro('//sitio-falso.exemplo')).toBe(ROTA_CONTA);
  });

  it('usa a conta quando não há destino', () => {
    expect(destinoSeguro(null)).toBe(ROTA_CONTA);
    expect(destinoSeguro('')).toBe(ROTA_CONTA);
  });
});
