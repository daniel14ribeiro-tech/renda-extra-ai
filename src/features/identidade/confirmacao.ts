import 'server-only';

import type { EmailOtpType } from '@supabase/supabase-js';

import { criarClienteServidor } from '@/lib/supabase/clientes';

const TIPOS_ACEITES: readonly string[] = [
  'signup',
  'recovery',
  'email_change',
  'invite',
  'magiclink',
];

/**
 * Confirma uma ligação enviada por email (confirmação de conta ou recuperação).
 *
 * O tipo vem do pedido e é comparado com uma lista fechada antes de ser usado:
 * nada que chegue de fora entra directamente numa chamada ao fornecedor.
 */
export async function confirmarLigacaoDeEmail(entrada: {
  readonly tokenHash: string | null;
  readonly tipo: string | null;
}): Promise<boolean> {
  const { tokenHash, tipo } = entrada;
  if (!tokenHash || !tipo || !TIPOS_ACEITES.includes(tipo)) return false;

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.verifyOtp({
    type: tipo as EmailOtpType,
    token_hash: tokenHash,
  });

  return !error;
}
