import { z } from 'zod';

import { parseEnv } from './parse';

/**
 * Ambiente exposto ao navegador.
 *
 * Tudo o que estiver aqui é público. Nunca acrescentar segredos a este ficheiro:
 * o prefixo NEXT_PUBLIC_ significa que o valor é embutido no pacote enviado ao cliente.
 *
 * As referências a process.env são escritas por extenso porque o Next só substitui
 * acessos estáticos — uma leitura dinâmica devolveria undefined em produção.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
  /** Projecto Supabase. A chave anónima é pública por desenho: a RLS é que protege. */
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv: ClientEnv = parseEnv(
  clientEnvSchema,
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  'cliente',
);
