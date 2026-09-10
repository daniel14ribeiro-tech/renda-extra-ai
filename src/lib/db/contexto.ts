import { sql } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

/**
 * Executa trabalho no contexto de um utilizador autenticado.
 *
 * A ligação da aplicação é feita com um papel privilegiado que ignora a RLS. Este
 * invólucro desce para o papel `authenticated` e declara o utilizador em curso
 * **dentro de uma transacção**, de modo que as políticas passam a decidir o que é
 * visível. `SET LOCAL` garante que o contexto morre com a transacção e não fica
 * agarrado à ligação para o pedido seguinte — que é como se vazam dados entre
 * utilizadores em pools de ligações.
 *
 * Todo o acesso a dados de utilizador passa por aqui. Uma consulta feita fora deste
 * contexto corre sem RLS.
 */
export async function executarComoUtilizador<TResultado, TQuery extends PgQueryResultHKT>(
  db: PgDatabase<TQuery, Record<string, unknown>>,
  utilizadorId: string,
  trabalho: (tx: PgDatabase<TQuery, Record<string, unknown>>) => Promise<TResultado>,
): Promise<TResultado> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('request.jwt.claims', ${JSON.stringify({ sub: utilizadorId })}, true)`,
    );
    await tx.execute(sql`set local role authenticated`);
    return trabalho(tx as unknown as PgDatabase<TQuery, Record<string, unknown>>);
  });
}

/**
 * Executa trabalho como visitante não autenticado, com o papel `anon`.
 * Existe para que a ausência de privilégios do visitante seja testável.
 */
export async function executarComoAnonimo<TResultado, TQuery extends PgQueryResultHKT>(
  db: PgDatabase<TQuery, Record<string, unknown>>,
  trabalho: (tx: PgDatabase<TQuery, Record<string, unknown>>) => Promise<TResultado>,
): Promise<TResultado> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('request.jwt.claims', '', true)`);
    await tx.execute(sql`set local role anon`);
    return trabalho(tx as unknown as PgDatabase<TQuery, Record<string, unknown>>);
  });
}
