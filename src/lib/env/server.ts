import 'server-only';

import { z } from 'zod';

import { parseEnv } from './parse';

/**
 * Ambiente do servidor.
 *
 * Validado uma vez, no arranque do processo. Este é o único ficheiro, com o seu par
 * `client.ts`, autorizado a ler process.env — regra imposta pelo ESLint.
 *
 * Cada fase acrescenta aqui as suas variáveis, e só quando forem realmente usadas:
 *   Fase 3  ANTHROPIC_API_KEY
 *   Fase 4  STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 *   Fase 5  RESEND_API_KEY, SENTRY_DSN
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  /**
   * Ligação directa ao Postgres. Usada pelo Drizzle e pelas migrações.
   * Contém credenciais: nunca com prefixo NEXT_PUBLIC_, nunca no cliente.
   */
  DATABASE_URL: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv: ServerEnv = parseEnv(
  serverEnvSchema,
  { NODE_ENV: process.env.NODE_ENV, DATABASE_URL: process.env.DATABASE_URL },
  'servidor',
);
