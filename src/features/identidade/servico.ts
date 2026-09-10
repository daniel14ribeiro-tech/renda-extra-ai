import { papeisEfectivos, temPeloMenos } from './autorizacao';
import {
  ErroDeAutenticacao,
  ErroDeAutorizacao,
  type FonteDeSessao,
  type LeitorDePapeis,
  type Papel,
  type UtilizadorAutenticado,
} from './tipos';

/** Devolve o utilizador em sessão, ou nulo. Não decide nada. */
export async function obterUtilizadorAtual(
  fonte: FonteDeSessao,
): Promise<UtilizadorAutenticado | null> {
  return fonte.obterUtilizador();
}

/**
 * Exige sessão iniciada. Usado por rotas e acções do servidor.
 * A ausência de sessão é erro, não um valor nulo a propagar-se pelo código.
 */
export async function exigirUtilizador(fonte: FonteDeSessao): Promise<UtilizadorAutenticado> {
  const utilizador = await fonte.obterUtilizador();
  if (!utilizador) throw new ErroDeAutenticacao();
  return utilizador;
}

/**
 * Exige sessão e privilégio. Autorização do lado do servidor, independente do que
 * a interface mostre ou esconda: esconder um botão não é uma medida de segurança.
 */
export async function exigirPapel(
  fonte: FonteDeSessao,
  leitor: LeitorDePapeis,
  minimo: Papel,
): Promise<UtilizadorAutenticado> {
  const utilizador = await exigirUtilizador(fonte);
  const papeis = papeisEfectivos(await leitor.papeisDe(utilizador.id));

  if (!temPeloMenos(papeis, minimo)) throw new ErroDeAutorizacao(minimo);
  return utilizador;
}
