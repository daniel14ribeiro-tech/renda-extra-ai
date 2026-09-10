import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { executarComoAnonimo, executarComoUtilizador } from '@/lib/db/contexto';
import { criarAmbienteDeTeste, type AmbienteDeTeste } from '@/lib/db/teste/ambiente';

import { criarRepositorioDeIdentidade } from './repositorio';

/**
 * Isolamento entre utilizadores.
 *
 * Corre contra um Postgres real com as migrações aplicadas: as políticas exercitadas
 * aqui são exactamente as que vão para produção.
 *
 * Cada capacidade é atacada por duas vias — SQL directo, como faria quem contornasse
 * a aplicação, e as funções de repositório que as rotas usam. Se só se testasse a
 * segunda, um erro na primeira passaria despercebido; se só a primeira, a aplicação
 * poderia estar a contornar a RLS sem que se soubesse.
 */
describe('isolamento entre utilizadores', () => {
  let ambiente: AmbienteDeTeste;
  let ana: string;
  let bruno: string;
  let repositorio: ReturnType<typeof criarRepositorioDeIdentidade>;

  beforeAll(async () => {
    ambiente = await criarAmbienteDeTeste();
    ana = await ambiente.criarUtilizador('ana@exemplo.pt');
    bruno = await ambiente.criarUtilizador('bruno@exemplo.pt');

    repositorio = criarRepositorioDeIdentidade(ambiente.db);
    await repositorio.criarPerfil(ana, 'Ana');
    await repositorio.criarPerfil(bruno, 'Bruno');
  });

  afterAll(async () => {
    await ambiente.fechar();
  });

  describe('leitura', () => {
    it('cada utilizador lê o seu próprio perfil', async () => {
      await expect(repositorio.obterPerfil(ana)).resolves.toMatchObject({
        nomeApresentacao: 'Ana',
      });
      await expect(repositorio.obterPerfil(bruno)).resolves.toMatchObject({
        nomeApresentacao: 'Bruno',
      });
    });

    it('a Ana não lê o perfil do Bruno pelo repositório', async () => {
      await expect(repositorio.obterPerfil(ana, bruno)).resolves.toBeNull();
    });

    it('a Ana não lê o perfil do Bruno por SQL directo, nem sem filtro', async () => {
      const visiveis = await executarComoUtilizador(ambiente.db, ana, async (tx) =>
        tx.execute(`select id, nome_apresentacao from perfis`),
      );

      expect(visiveis.rows).toHaveLength(1);
      expect(visiveis.rows[0]).toMatchObject({ id: ana });
    });

    it('a Ana não lê os papéis do Bruno', async () => {
      await ambiente.atribuirPapel(bruno, 'curador');

      await expect(repositorio.papeisDe(ana, bruno)).resolves.toEqual([]);
      await expect(repositorio.papeisDe(bruno)).resolves.toEqual(['curador']);
    });
  });

  describe('alteração', () => {
    it('a Ana altera o seu próprio nome', async () => {
      await expect(repositorio.actualizarNome(ana, ana, 'Ana Maria')).resolves.toBe(1);
      await expect(repositorio.obterPerfil(ana)).resolves.toMatchObject({
        nomeApresentacao: 'Ana Maria',
      });
    });

    it('a Ana não altera o perfil do Bruno: nenhuma linha é afectada', async () => {
      await expect(repositorio.actualizarNome(ana, bruno, 'invadido')).resolves.toBe(0);
      await expect(repositorio.obterPerfil(bruno)).resolves.toMatchObject({
        nomeApresentacao: 'Bruno',
      });
    });

    it('a Ana não altera o perfil do Bruno por SQL directo', async () => {
      await executarComoUtilizador(ambiente.db, ana, async (tx) =>
        tx.execute(`update perfis set nome_apresentacao = 'invadido'`),
      );

      await expect(repositorio.obterPerfil(bruno)).resolves.toMatchObject({
        nomeApresentacao: 'Bruno',
      });
    });

    it('a Ana não cria um perfil em nome do Bruno', async () => {
      await expect(
        executarComoUtilizador(ambiente.db, ana, async (tx) =>
          tx.execute(`insert into perfis (id) values ('${bruno}')`),
        ),
      ).rejects.toThrow();
    });
  });

  describe('eliminação', () => {
    it('ninguém apaga perfis: o privilégio não existe', async () => {
      await expect(
        executarComoUtilizador(ambiente.db, ana, async (tx) =>
          tx.execute(`delete from perfis where id = '${ana}'`),
        ),
      ).rejects.toThrow();

      await expect(
        executarComoUtilizador(ambiente.db, ana, async (tx) =>
          tx.execute(`delete from perfis where id = '${bruno}'`),
        ),
      ).rejects.toThrow();
    });
  });

  describe('escalada de privilégios', () => {
    it('a Ana não se promove a curadora', async () => {
      await expect(
        executarComoUtilizador(ambiente.db, ana, async (tx) =>
          tx.execute(
            `insert into papeis_utilizador (utilizador_id, papel) values ('${ana}', 'curador')`,
          ),
        ),
      ).rejects.toThrow();

      await expect(repositorio.papeisDe(ana)).resolves.toEqual([]);
    });

    it('a Ana não se atribui um papel apagando ou alterando linhas existentes', async () => {
      await expect(
        executarComoUtilizador(ambiente.db, ana, async (tx) =>
          tx.execute(`update papeis_utilizador set utilizador_id = '${ana}'`),
        ),
      ).rejects.toThrow();

      await expect(repositorio.papeisDe(bruno)).resolves.toEqual(['curador']);
    });
  });

  describe('visitante anónimo', () => {
    it('não lê perfis', async () => {
      await expect(
        executarComoAnonimo(ambiente.db, async (tx) => tx.execute(`select id from perfis`)),
      ).rejects.toThrow();
    });

    it('não lê papéis', async () => {
      await expect(
        executarComoAnonimo(ambiente.db, async (tx) =>
          tx.execute(`select papel from papeis_utilizador`),
        ),
      ).rejects.toThrow();
    });
  });

  describe('contexto de sessão', () => {
    it('não sobrevive à transacção que o criou', async () => {
      await executarComoUtilizador(ambiente.db, ana, async (tx) => tx.execute(`select 1`));

      const resultado = await ambiente.db.execute(
        `select coalesce(current_setting('request.jwt.claims', true), '') as claims,
                current_user as papel`,
      );
      const fora = resultado.rows[0] as { claims: string; papel: string };

      // Fora da transacção não resta identidade nem papel elevado: a ligação
      // seguinte, que num pool pode servir outra pessoa, começa limpa.
      expect(fora.claims).not.toContain(ana);
      expect(fora.papel).not.toBe('authenticated');
    });
  });
});
