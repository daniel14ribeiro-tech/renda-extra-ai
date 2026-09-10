import type { ZodType } from 'zod';

import {
  esquemaEntrada,
  esquemaNovaPalavraPasse,
  esquemaRecuperacao,
  esquemaRegisto,
} from './validacao';
import type { ServicoDeAutenticacao } from './tipos';

export type EstadoFormulario =
  | { readonly estado: 'inicial' }
  | { readonly estado: 'sucesso' }
  | { readonly estado: 'aviso'; readonly mensagem: string }
  | { readonly estado: 'erro'; readonly mensagem: string };

export const ESTADO_INICIAL: EstadoFormulario = { estado: 'inicial' };

/**
 * Valida a entrada e devolve o primeiro problema em linguagem corrente.
 * Nunca ecoa o valor recebido: um erro de formulário não é sítio para devolver
 * ao ecrã aquilo que a pessoa escreveu no campo da palavra-passe.
 */
function validar<T>(esquema: ZodType<T>, dados: unknown): T | EstadoFormulario {
  const resultado = esquema.safeParse(dados);
  if (resultado.success) return resultado.data;

  const primeiro = resultado.error.issues[0];
  return { estado: 'erro', mensagem: primeiro?.message ?? 'Os dados enviados não são válidos.' };
}

function eFalha(valor: unknown): valor is EstadoFormulario {
  return typeof valor === 'object' && valor !== null && 'estado' in valor;
}

export async function fluxoRegistar(
  servico: ServicoDeAutenticacao,
  dados: unknown,
): Promise<EstadoFormulario> {
  const validado = validar(esquemaRegisto, dados);
  if (eFalha(validado)) return validado;

  const resultado = await servico.registar(validado.email, validado.palavraPasse);
  if (resultado.estado === 'erro') return { estado: 'erro', mensagem: resultado.mensagem };

  return {
    estado: 'aviso',
    mensagem: 'Enviámos-te um email para confirmares a conta. Verifica a tua caixa de entrada.',
  };
}

export async function fluxoEntrar(
  servico: ServicoDeAutenticacao,
  dados: unknown,
): Promise<EstadoFormulario> {
  const validado = validar(esquemaEntrada, dados);
  if (eFalha(validado)) return validado;

  const resultado = await servico.entrar(validado.email, validado.palavraPasse);
  if (resultado.estado === 'erro') return { estado: 'erro', mensagem: resultado.mensagem };

  return { estado: 'sucesso' };
}

export async function fluxoRecuperarAcesso(
  servico: ServicoDeAutenticacao,
  dados: unknown,
): Promise<EstadoFormulario> {
  const validado = validar(esquemaRecuperacao, dados);
  if (eFalha(validado)) return validado;

  await servico.pedirRecuperacaoDeAcesso(validado.email);

  // A mesma resposta exista ou não a conta. Ver o serviço de autenticação.
  return {
    estado: 'aviso',
    mensagem: 'Se existir uma conta com esse email, enviámos as instruções de recuperação.',
  };
}

export async function fluxoDefinirPalavraPasse(
  servico: ServicoDeAutenticacao,
  dados: unknown,
): Promise<EstadoFormulario> {
  const validado = validar(esquemaNovaPalavraPasse, dados);
  if (eFalha(validado)) return validado;

  const resultado = await servico.definirNovaPalavraPasse(validado.palavraPasse);
  if (resultado.estado === 'erro') return { estado: 'erro', mensagem: resultado.mensagem };

  return { estado: 'sucesso' };
}
