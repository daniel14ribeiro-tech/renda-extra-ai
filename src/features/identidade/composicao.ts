import 'server-only';

import { obterBaseDeDados } from '@/lib/db/ligacao';
import { criarFonteDeSessao } from '@/lib/supabase/fonte-de-sessao';
import { criarServicoDeAutenticacao } from '@/lib/supabase/servico-de-autenticacao';

import { criarRepositorioDeIdentidade } from './repositorio';
import type { LeitorDePapeis } from './tipos';

/**
 * Ponto de composição: onde as portas do domínio encontram os adaptadores.
 *
 * É o único ficheiro do domínio que conhece o fornecedor. Tudo o resto em
 * features/identidade continua a poder ser lido, e testado, sem saber que existe
 * um Supabase do outro lado.
 */
export const fonteDeSessao = criarFonteDeSessao;
export const servicoDeAutenticacao = criarServicoDeAutenticacao;

export function repositorioDeIdentidade() {
  return criarRepositorioDeIdentidade(obterBaseDeDados());
}

export function leitorDePapeis(): LeitorDePapeis {
  const repositorio = repositorioDeIdentidade();
  return { papeisDe: (utilizadorId) => repositorio.papeisDe(utilizadorId) };
}
