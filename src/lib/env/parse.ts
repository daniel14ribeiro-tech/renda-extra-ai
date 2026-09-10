import type { ZodType } from 'zod';

/**
 * Falha de validação do ambiente. Lançada no arranque, nunca em tempo de pedido:
 * um processo com ambiente inválido não deve chegar a servir tráfego.
 */
export class EnvironmentError extends Error {
  readonly problems: readonly string[];

  constructor(scope: string, problems: readonly string[]) {
    super(`Ambiente inválido (${scope}):\n  - ${problems.join('\n  - ')}`);
    this.name = 'EnvironmentError';
    this.problems = problems;
  }
}

/**
 * Substitui, na mensagem, qualquer ocorrência do valor recebido.
 *
 * Uma mensagem de erro de ambiente vai para registos e para consolas de terceiros.
 * Se uma chave secreta estiver mal formada, a mensagem não pode transportá-la.
 */
function redigirValor(mensagem: string, valor: unknown): string {
  if (typeof valor !== 'string' || valor.length === 0) return mensagem;
  return mensagem.split(valor).join('[redigido]');
}

function descreverProblema(
  caminho: readonly PropertyKey[],
  mensagem: string,
  origem: unknown,
): string {
  const chave = caminho.length > 0 ? caminho.map(String).join('.') : '(raiz)';
  const valor =
    typeof origem === 'object' && origem !== null && caminho.length === 1
      ? (origem as Record<string, unknown>)[String(caminho[0])]
      : undefined;

  return `${chave}: ${redigirValor(mensagem, valor)}`;
}

/**
 * Valida uma origem de variáveis de ambiente contra um esquema.
 * Agrega todos os problemas numa só falha — corrigir o ambiente a conta-gotas é desperdício.
 */
export function parseEnv<T>(schema: ZodType<T>, origem: unknown, scope: string): T {
  const resultado = schema.safeParse(origem);

  if (!resultado.success) {
    const problemas = resultado.error.issues.map((issue) =>
      descreverProblema(issue.path, issue.message, origem),
    );
    throw new EnvironmentError(scope, problemas);
  }

  return resultado.data;
}
