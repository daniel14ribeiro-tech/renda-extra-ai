import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { EnvironmentError, parseEnv } from './parse';

describe('parseEnv', () => {
  it('devolve os valores validados quando o ambiente está correcto', () => {
    const schema = z.object({ MODO: z.enum(['dev', 'prod']) });

    expect(parseEnv(schema, { MODO: 'prod' }, 'teste')).toEqual({ MODO: 'prod' });
  });

  it('aplica valores por omissão definidos no esquema', () => {
    const schema = z.object({ MODO: z.enum(['dev', 'prod']).default('dev') });

    expect(parseEnv(schema, {}, 'teste')).toEqual({ MODO: 'dev' });
  });

  it('lança EnvironmentError identificando a variável em falta', () => {
    const schema = z.object({ EM_FALTA: z.string() });

    expect(() => parseEnv(schema, {}, 'servidor')).toThrow(EnvironmentError);

    try {
      parseEnv(schema, {}, 'servidor');
      expect.unreachable('deveria ter lançado');
    } catch (erro) {
      expect(erro).toBeInstanceOf(EnvironmentError);
      expect((erro as EnvironmentError).problems).toHaveLength(1);
      expect((erro as EnvironmentError).problems[0]).toContain('EM_FALTA');
      expect((erro as EnvironmentError).message).toContain('servidor');
    }
  });

  it('agrega todos os problemas numa só falha', () => {
    const schema = z.object({ UM: z.string(), DOIS: z.string(), TRES: z.string() });

    try {
      parseEnv(schema, { UM: 'ok' }, 'servidor');
      expect.unreachable('deveria ter lançado');
    } catch (erro) {
      expect((erro as EnvironmentError).problems).toHaveLength(2);
    }
  });

  it('nunca deixa o valor recebido aparecer na mensagem de erro', () => {
    const segredo = 'sk-uma-chave-secreta-mal-formada';
    const schema = z.object({ CHAVE: z.string().min(100) });

    try {
      parseEnv(schema, { CHAVE: segredo }, 'servidor');
      expect.unreachable('deveria ter lançado');
    } catch (erro) {
      expect((erro as EnvironmentError).message).not.toContain(segredo);
    }
  });
});
