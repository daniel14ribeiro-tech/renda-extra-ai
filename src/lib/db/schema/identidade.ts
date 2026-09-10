import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { authUid, authUsers, authenticatedRole } from 'drizzle-orm/supabase';

import { papelUtilizador } from './enums';

/**
 * Perfil do utilizador. A identidade vive em auth.users (Supabase);
 * aqui fica apenas o que é do domínio.
 */
export const perfis = pgTable(
  'perfis',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    nomeApresentacao: text('nome_apresentacao'),
    criadoEm: timestamp('criado_em', { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy('perfis_ler_proprio', {
      for: 'select',
      to: authenticatedRole,
      using: sql`id = ${authUid}`,
    }),
    pgPolicy('perfis_inserir_proprio', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`id = ${authUid}`,
    }),
    pgPolicy('perfis_actualizar_proprio', {
      for: 'update',
      to: authenticatedRole,
      using: sql`id = ${authUid}`,
      withCheck: sql`id = ${authUid}`,
    }),
    // Não existe política de DELETE: apagar a conta é operação de administração,
    // feita pela eliminação em auth.users, que cascateia para aqui.
  ],
).enableRLS();

/**
 * Papéis atribuídos a cada utilizador.
 *
 * Sem política de escrita para o papel `authenticated`: um utilizador nunca se
 * promove a si próprio. A atribuição é feita por código de administração, com a
 * chave de serviço, e é auditada.
 */
export const papeisUtilizador = pgTable(
  'papeis_utilizador',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    utilizadorId: uuid('utilizador_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    papel: papelUtilizador('papel').notNull(),
    atribuidoEm: timestamp('atribuido_em', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('papeis_utilizador_unico').on(t.utilizadorId, t.papel),
    pgPolicy('papeis_ler_proprios', {
      for: 'select',
      to: authenticatedRole,
      using: sql`utilizador_id = ${authUid}`,
    }),
  ],
).enableRLS();
