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
 *   Fase 1  DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   Fase 3  ANTHROPIC_API_KEY
 *   Fase 4  STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 *   Fase 5  RESEND_API_KEY, SENTRY_DSN
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv: ServerEnv = parseEnv(
  serverEnvSchema,
  { NODE_ENV: process.env.NODE_ENV },
  'servidor',
);
