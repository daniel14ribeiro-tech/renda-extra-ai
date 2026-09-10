import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { executarComoUtilizador } from '@/lib/db/contexto';
import { criarAmbienteDeTeste, type AmbienteDeTeste } from '@/lib/db/teste/ambiente';

import { carregarEntradasDoConteudo } from './conteudo';
import { criarRepositorioDeCatalogo } from './repositorio';
import type { EntradaCatalogo } from './esquema';

/**
 * Prova que o modelo de dados aguenta as entradas reais, e que o catálogo obedece
 * às regras de curadoria dentro da base de dados e não apenas em documentos.
 *
 * As três entradas foram escolhidas deliberadamente diferentes — serviço local,
 * serviço remoto e produto digital — para partir o modelo cedo, enquanto isso
 * ainda é barato.
 */
describe('catálogo na base de dados', () => {
  let ambiente: AmbienteDeTeste;
  let repositorio: ReturnType<typeof criarRepositorioDeCatalogo>;
  let curadora: string;
  let utilizadorComum: string;
  let entradas: readonly EntradaCatalogo[];
  const identificadores = new Map<string, string>();

  beforeAll(async () => {
    ambiente = await criarAmbienteDeTeste();
    repositorio = criarRepositorioDeCatalogo(ambiente.db);
    entradas = await carregarEntradasDoConteudo();

    curadora = await ambiente.criarUtilizador('curadora@exemplo.pt');
    utilizadorComum = await ambiente.criarUtilizador('utilizador@exemplo.pt');
    await ambiente.atribuirPapel(curadora, 'curador');

    for (const entrada of entradas) {
      identificadores.set(entrada.referencia, await repositorio.guardar(curadora, entrada));
    }
  });

  afterAll(async () => {
    await ambiente.fechar();
  });

  it('grava as três entradas completas, com fases e tarefas', async () => {
    expect(identificadores.size).toBe(3);

    for (const entrada of entradas) {
      const id = identificadores.get(entrada.referencia);
      const tarefasEsperadas = entrada.fases.reduce(
        (total, fase) => total + fase.tarefas.length,
        0,
      );

      await expect(repositorio.contarTarefas(curadora, id!), entrada.referencia).resolves.toBe(
        tarefasEsperadas,
      );
    }
  });

  it('preserva sem perdas os campos estruturados', async () => {
    const original = entradas[0]!;
    const { rows } = await ambiente.pg.query<{
      validacao: unknown;
      requisitos_legais: unknown;
      pendencias_verificacao: unknown;
      faixa_rendimento_mensal: unknown;
    }>(
      'select validacao, requisitos_legais, pendencias_verificacao, faixa_rendimento_mensal from entradas_catalogo where referencia = $1',
      [original.referencia],
    );

    expect(rows[0]?.validacao).toEqual(original.validacao);
    expect(rows[0]?.requisitos_legais).toEqual(original.requisitosLegais);
    expect(rows[0]?.pendencias_verificacao).toEqual(original.pendenciasVerificacao);
    expect(rows[0]?.faixa_rendimento_mensal).toBeNull();
  });

  describe('visibilidade por estado de curadoria', () => {
    it('a curadora vê os seus rascunhos', async () => {
      await expect(repositorio.listarVisiveis(curadora)).resolves.toHaveLength(3);
    });

    it('o utilizador comum não vê rascunho nenhum', async () => {
      await expect(repositorio.listarVisiveis(utilizadorComum)).resolves.toEqual([]);
    });

    it('o utilizador comum passa a ver o que for publicado, e só isso', async () => {
      const referencia = entradas[1]!.referencia;

      await executarComoUtilizador(ambiente.db, curadora, async (tx) =>
        tx.execute(
          `update entradas_catalogo set estado = 'publicado' where referencia = '${referencia}'`,
        ),
      );

      const visiveis = await repositorio.listarVisiveis(utilizadorComum);
      expect(visiveis).toHaveLength(1);
      expect(visiveis[0]).toMatchObject({ referencia, estado: 'publicado' });
    });
  });

  describe('curar é acto privilegiado', () => {
    it('o utilizador comum não cria entradas', async () => {
      await expect(repositorio.guardar(utilizadorComum, entradas[0]!)).rejects.toThrow();
    });

    it('o utilizador comum não altera uma entrada publicada', async () => {
      const referencia = entradas[1]!.referencia;

      await executarComoUtilizador(ambiente.db, utilizadorComum, async (tx) =>
        tx.execute(
          `update entradas_catalogo set titulo = 'alterado' where referencia = '${referencia}'`,
        ),
      );

      const { rows } = await ambiente.pg.query<{ titulo: string }>(
        'select titulo from entradas_catalogo where referencia = $1',
        [referencia],
      );
      expect(rows[0]?.titulo).toBe(entradas[1]!.titulo);
    });

    it('o utilizador comum não apaga entradas', async () => {
      await executarComoUtilizador(ambiente.db, utilizadorComum, async (tx) =>
        tx.execute(`delete from entradas_catalogo`),
      );

      const { rows } = await ambiente.pg.query<{ total: string }>(
        'select count(*)::text as total from entradas_catalogo',
      );
      expect(rows[0]?.total).toBe('3');
    });

    it('o utilizador comum não vê as tarefas de uma entrada não publicada', async () => {
      const idRascunho = identificadores.get(entradas[0]!.referencia)!;
      await expect(repositorio.contarTarefas(utilizadorComum, idRascunho)).resolves.toBe(0);
    });
  });
});
