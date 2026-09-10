export const ROTA_ENTRAR = '/entrar';
export const ROTA_CONTA = '/conta';
export const ROTA_REDEFINIR = '/redefinir-palavra-passe';

/** Rotas que exigem sessão iniciada. */
const PROTEGIDAS: readonly string[] = [ROTA_CONTA, ROTA_REDEFINIR];

/** Rotas que só fazem sentido sem sessão. */
const SO_SEM_SESSAO: readonly string[] = [ROTA_ENTRAR, '/registar', '/recuperar-acesso'];

export type DecisaoDeAcesso =
  { readonly accao: 'permitir' } | { readonly accao: 'redireccionar'; readonly destino: string };

function correspondeA(caminho: string, rotas: readonly string[]): boolean {
  return rotas.some((rota) => caminho === rota || caminho.startsWith(`${rota}/`));
}

/**
 * Política de acesso às rotas, como função pura.
 *
 * Vive separada do middleware para poder ser testada sem levantar um servidor —
 * e porque uma regra de acesso que só existe dentro de um handler é uma regra que
 * ninguém consegue verificar.
 *
 * Isto **não** é a protecção dos dados: é conveniência de navegação. Quem chegar
 * a uma rota protegida sem sessão encontra na mesma a RLS e a verificação de
 * autorização do lado do servidor.
 */
export function decidirAcesso(entrada: {
  readonly caminho: string;
  readonly temSessao: boolean;
}): DecisaoDeAcesso {
  const { caminho, temSessao } = entrada;

  if (!temSessao && correspondeA(caminho, PROTEGIDAS)) {
    const regressar = encodeURIComponent(caminho);
    return { accao: 'redireccionar', destino: `${ROTA_ENTRAR}?regressar=${regressar}` };
  }

  if (temSessao && correspondeA(caminho, SO_SEM_SESSAO)) {
    return { accao: 'redireccionar', destino: ROTA_CONTA };
  }

  return { accao: 'permitir' };
}

/**
 * Valida o destino de regresso antes de o usar num redireccionamento.
 * Aceitar um destino vindo do pedido sem o validar é uma redirecção aberta:
 * bastaria `?regressar=https://sitio-falso` para nos servirmos de trampolim.
 */
export function destinoSeguro(regressar: string | null | undefined): string {
  if (!regressar) return ROTA_CONTA;
  if (!regressar.startsWith('/') || regressar.startsWith('//')) return ROTA_CONTA;
  return regressar;
}
