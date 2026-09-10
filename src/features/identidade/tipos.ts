/**
 * Contratos de domínio da identidade.
 *
 * Nada aqui sabe que o fornecedor é o Supabase. Trocar de fornecedor é reescrever
 * os adaptadores em src/lib/supabase, não este ficheiro.
 */

/** Papéis, por ordem crescente de privilégio. Espelha o enum `papel_utilizador`. */
export const PAPEIS = ['utilizador', 'curador', 'administrador'] as const;

export type Papel = (typeof PAPEIS)[number];

export interface UtilizadorAutenticado {
  readonly id: string;
  readonly email: string;
}

export interface Perfil {
  readonly id: string;
  readonly nomeApresentacao: string | null;
}

/** Lança-se quando não há sessão. Corresponde a 401. */
export class ErroDeAutenticacao extends Error {
  constructor(mensagem = 'É preciso ter sessão iniciada.') {
    super(mensagem);
    this.name = 'ErroDeAutenticacao';
  }
}

/** Lança-se quando há sessão mas faltam privilégios. Corresponde a 403. */
export class ErroDeAutorizacao extends Error {
  readonly papelExigido: Papel;

  constructor(papelExigido: Papel) {
    super(`Esta operação exige o papel "${papelExigido}".`);
    this.name = 'ErroDeAutorizacao';
    this.papelExigido = papelExigido;
  }
}

/** Porta: quem está autenticado neste pedido. */
export interface FonteDeSessao {
  obterUtilizador(): Promise<UtilizadorAutenticado | null>;
}

/** Porta: que papéis tem um utilizador. */
export interface LeitorDePapeis {
  papeisDe(utilizadorId: string): Promise<readonly Papel[]>;
}

export type ResultadoAutenticacao =
  | { readonly estado: 'sucesso' }
  | { readonly estado: 'confirmacao_pendente' }
  | { readonly estado: 'erro'; readonly mensagem: string };

/** Porta: operações de autenticação oferecidas pelo fornecedor. */
export interface ServicoDeAutenticacao {
  registar(email: string, palavraPasse: string): Promise<ResultadoAutenticacao>;
  entrar(email: string, palavraPasse: string): Promise<ResultadoAutenticacao>;
  sair(): Promise<ResultadoAutenticacao>;
  pedirRecuperacaoDeAcesso(email: string): Promise<ResultadoAutenticacao>;
  definirNovaPalavraPasse(palavraPasse: string): Promise<ResultadoAutenticacao>;
}
