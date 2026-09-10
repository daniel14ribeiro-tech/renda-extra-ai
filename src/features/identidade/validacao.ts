import { z } from 'zod';

/**
 * Comprimento mínimo da palavra-passe.
 *
 * Comprimento em vez de regras de composição: obrigar a maiúsculas e símbolos
 * produz variações previsíveis da mesma palavra, enquanto o comprimento aumenta
 * o custo de a adivinhar sem tornar a vida impossível a quem a escreve.
 */
export const MINIMO_PALAVRA_PASSE = 12;

const email = z.email('Escreve um endereço de email válido.');

const palavraPasse = z
  .string()
  .min(
    MINIMO_PALAVRA_PASSE,
    `A palavra-passe precisa de pelo menos ${MINIMO_PALAVRA_PASSE} caracteres.`,
  )
  .max(200, 'A palavra-passe é demasiado longa.');

export const esquemaEntrada = z.object({
  email,
  // Na entrada não se valida comprimento: dizer que "é curta" revelaria a regra a
  // quem tenta adivinhar, e a credencial ou está certa ou não está.
  palavraPasse: z.string().min(1, 'Escreve a tua palavra-passe.'),
});

export const esquemaRegisto = z.object({ email, palavraPasse });

export const esquemaRecuperacao = z.object({ email });

export const esquemaNovaPalavraPasse = z.object({ palavraPasse });

export type DadosEntrada = z.infer<typeof esquemaEntrada>;
export type DadosRegisto = z.infer<typeof esquemaRegisto>;
