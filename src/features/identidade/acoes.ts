'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { servicoDeAutenticacao } from './composicao';
import {
  fluxoDefinirPalavraPasse,
  fluxoEntrar,
  fluxoRecuperarAcesso,
  fluxoRegistar,
  type EstadoFormulario,
} from './fluxos';
import { destinoSeguro, ROTA_CONTA, ROTA_ENTRAR } from './rotas';

/**
 * Acções do servidor.
 *
 * São invólucros finos: validam nada, decidem nada. Toda a lógica está em
 * `fluxos.ts`, que é testável sem Next e sem fornecedor. O que sobra aqui é ler o
 * formulário e redireccionar.
 */

export async function accaoRegistar(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  return fluxoRegistar(servicoDeAutenticacao(), {
    email: formulario.get('email'),
    palavraPasse: formulario.get('palavraPasse'),
  });
}

export async function accaoEntrar(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const estado = await fluxoEntrar(servicoDeAutenticacao(), {
    email: formulario.get('email'),
    palavraPasse: formulario.get('palavraPasse'),
  });

  if (estado.estado !== 'sucesso') return estado;

  const regressar = formulario.get('regressar');
  redirect(destinoSeguro(typeof regressar === 'string' ? regressar : null));
}

export async function accaoRecuperarAcesso(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  return fluxoRecuperarAcesso(servicoDeAutenticacao(), { email: formulario.get('email') });
}

export async function accaoDefinirPalavraPasse(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const estado = await fluxoDefinirPalavraPasse(servicoDeAutenticacao(), {
    palavraPasse: formulario.get('palavraPasse'),
  });

  if (estado.estado !== 'sucesso') return estado;

  revalidatePath(ROTA_CONTA);
  redirect(ROTA_CONTA);
}

export async function accaoTerminarSessao(): Promise<void> {
  await servicoDeAutenticacao().sair();
  revalidatePath('/', 'layout');
  redirect(ROTA_ENTRAR);
}
