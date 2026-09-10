import { type Papel } from './tipos';

/** Privilégio crescente. Um papel superior cobre os inferiores. */
const NIVEL: Record<Papel, number> = {
  utilizador: 0,
  curador: 1,
  administrador: 2,
};

/**
 * Verdadeiro se algum dos papéis atribuídos cobre o mínimo exigido.
 *
 * Função pura e sem dependências: é a regra de autorização, e é aqui que se testa.
 * A RLS decide que linhas; isto decide que operações — as duas camadas, não uma.
 */
export function temPeloMenos(papeis: readonly Papel[], minimo: Papel): boolean {
  const exigido = NIVEL[minimo];
  return papeis.some((papel) => NIVEL[papel] >= exigido);
}

/** Curar é acto humano e privilegiado. Ver docs/produto/processo-curadoria.md. */
export function podeCurarCatalogo(papeis: readonly Papel[]): boolean {
  return temPeloMenos(papeis, 'curador');
}

/**
 * Papel efectivo: todo o utilizador autenticado é pelo menos `utilizador`,
 * mesmo sem nenhuma linha atribuída.
 */
export function papeisEfectivos(papeisAtribuidos: readonly Papel[]): readonly Papel[] {
  return papeisAtribuidos.includes('utilizador')
    ? papeisAtribuidos
    : ['utilizador', ...papeisAtribuidos];
}
