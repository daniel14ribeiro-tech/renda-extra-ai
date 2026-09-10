import 'server-only';

import { papeisEfectivos } from './autorizacao';
import { fonteDeSessao, repositorioDeIdentidade } from './composicao';
import { exigirUtilizador } from './servico';
import type { Papel, Perfil, UtilizadorAutenticado } from './tipos';

export interface EstadoDaConta {
  readonly utilizador: UtilizadorAutenticado;
  readonly perfil: Perfil | null;
  readonly papeis: readonly Papel[];
}

/**
 * Estado da conta do utilizador em sessão.
 *
 * Lança se não houver sessão: a verificação acontece no servidor, em cada pedido,
 * e não depende do middleware ter corrido — o middleware trata da navegação, não
 * da segurança.
 */
export async function obterEstadoDaConta(): Promise<EstadoDaConta> {
  const utilizador = await exigirUtilizador(fonteDeSessao());
  const repositorio = repositorioDeIdentidade();

  await repositorio.garantirPerfil(utilizador.id);

  const [perfil, papeisAtribuidos] = await Promise.all([
    repositorio.obterPerfil(utilizador.id),
    repositorio.papeisDe(utilizador.id),
  ]);

  return { utilizador, perfil, papeis: papeisEfectivos(papeisAtribuidos) };
}
