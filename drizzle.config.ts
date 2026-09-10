import { defineConfig } from 'drizzle-kit';

/**
 * O esquema `auth` pertence ao Supabase e nunca é gerido por nós:
 * `schemaFilter` mantém as migrações confinadas a `public`.
 *
 * Este ficheiro é ferramenta de linha de comandos, não código de aplicação —
 * é o único sítio fora de src/lib/env autorizado a ler process.env.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema/index.ts',
  out: './src/lib/db/migrations',
  schemaFilter: ['public'],
  entities: {
    roles: { provider: 'supabase' },
  },
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
