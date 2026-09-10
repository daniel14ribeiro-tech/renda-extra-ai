import type { EntradaCatalogo } from './esquema';

/** Cadência de revisão por classe de volatilidade, em dias. Ver processo-curadoria.md §4. */
export const CADENCIA_DIAS: Record<EntradaCatalogo['classeVolatilidade'], number> = {
  alta: 90,
  media: 180,
  baixa: 365,
};

/** Prazo extra antes de uma entrada vencida ser arquivada. */
export const TOLERANCIA_ARQUIVO_DIAS = 90;

function somarDias(data: string, dias: number): string {
  const resultado = new Date(`${data}T00:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
}

export function calcularProximaRevisao(
  dataUltimaRevisao: string,
  classe: EntradaCatalogo['classeVolatilidade'],
): string {
  return somarDias(dataUltimaRevisao, CADENCIA_DIAS[classe]);
}

/**
 * Checklist de publicação, em código.
 *
 * Devolve os motivos que impedem a publicação. Vazio significa publicável.
 * A checklist estar escrita num documento não impede ninguém de publicar uma
 * entrada incompleta; estar aqui, sim.
 */
export function motivosParaNaoPublicar(entrada: EntradaCatalogo): readonly string[] {
  const motivos: string[] = [];

  if (entrada.pendenciasVerificacao.length > 0) {
    motivos.push(
      `Há ${entrada.pendenciasVerificacao.length} campo(s) por verificar: ${entrada.pendenciasVerificacao
        .map((p) => p.campo)
        .join(', ')}.`,
    );
  }

  if (entrada.faixaRendimentoMensal === null) {
    motivos.push('Sem faixa de rendimento verificada com fonte e data.');
  }

  if (entrada.requisitosLegais.some((r) => r.estado === 'pendente_verificacao')) {
    motivos.push('Há requisitos legais ou fiscais por confirmar.');
  }

  if (entrada.fontes.length === 0) {
    motivos.push('Sem fontes registadas.');
  }

  if (entrada.curador === 'por-atribuir') {
    motivos.push('Sem curador atribuído.');
  }

  if (
    entrada.dataProximaRevisao !==
    calcularProximaRevisao(entrada.dataUltimaRevisao, entrada.classeVolatilidade)
  ) {
    motivos.push('A próxima revisão não corresponde à cadência da classe de volatilidade.');
  }

  return motivos;
}

export function podeSerPublicada(entrada: EntradaCatalogo): boolean {
  return motivosParaNaoPublicar(entrada).length === 0;
}

/**
 * Estado a que uma entrada deve degradar-se sozinha quando passa o prazo.
 * O catálogo não fica silenciosamente desactualizado à espera que alguém repare.
 */
export function estadoAposPrazo(
  entrada: Pick<EntradaCatalogo, 'estado' | 'dataProximaRevisao'>,
  hoje: string,
): EntradaCatalogo['estado'] {
  if (entrada.estado !== 'publicado' && entrada.estado !== 'em_atualizacao') return entrada.estado;

  if (hoje > somarDias(entrada.dataProximaRevisao, TOLERANCIA_ARQUIVO_DIAS)) return 'arquivado';
  if (hoje > entrada.dataProximaRevisao) return 'em_atualizacao';

  return entrada.estado;
}
