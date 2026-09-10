import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { criarAmbienteDeTeste, type AmbienteDeTeste } from './teste/ambiente';

/**
 * Auditoria das migrações.
 *
 * Não testa funcionalidades: testa que o esquema que vai para produção tem as
 * propriedades de segurança que dizemos ter. Uma tabela nova sem RLS falha aqui,
 * e é esse o objectivo — a regra deixa de depender de alguém se lembrar dela.
 */
describe('migrações', () => {
  let ambiente: AmbienteDeTeste;

  beforeAll(async () => {
    ambiente = await criarAmbienteDeTeste();
  });

  afterAll(async () => {
    await ambiente.fechar();
  });

  it('aplica todas as migrações do jornal sem erro', () => {
    expect(ambiente.migracoesAplicadas).toEqual(['0000_inicial', '0001_seguranca']);
  });

  it('activa e força RLS em todas as tabelas de public', async () => {
    const { rows } = await ambiente.pg.query<{
      tabela: string;
      activa: boolean;
      forcada: boolean;
    }>(`
      select c.relname as tabela, c.relrowsecurity as activa, c.relforcerowsecurity as forcada
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
      order by c.relname
    `);

    expect(rows.length).toBeGreaterThan(0);

    const semProteccao = rows.filter((t) => !t.activa || !t.forcada);
    expect(
      semProteccao,
      `tabelas sem RLS activa e forçada: ${JSON.stringify(semProteccao)}`,
    ).toEqual([]);
  });

  it('não deixa nenhuma tabela sem pelo menos uma política', async () => {
    const { rows } = await ambiente.pg.query<{ tabela: string }>(`
      select c.relname as tabela
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
        and not exists (select 1 from pg_policy p where p.polrelid = c.oid)
    `);

    expect(rows, `tabelas sem política: ${JSON.stringify(rows)}`).toEqual([]);
  });

  it('não concede qualquer privilégio ao visitante anónimo', async () => {
    const { rows } = await ambiente.pg.query<{ table_name: string; privilege_type: string }>(`
      select table_name, privilege_type
      from information_schema.role_table_grants
      where grantee = 'anon' and table_schema = 'public'
    `);

    expect(rows).toEqual([]);
  });

  it('concede ao utilizador autenticado exactamente os privilégios previstos', async () => {
    const { rows } = await ambiente.pg.query<{ table_name: string; privilege_type: string }>(`
      select table_name, privilege_type
      from information_schema.role_table_grants
      where grantee = 'authenticated' and table_schema = 'public'
      order by table_name, privilege_type
    `);

    const concedido = rows.reduce<Record<string, string[]>>((acumulado, linha) => {
      (acumulado[linha.table_name] ??= []).push(linha.privilege_type);
      return acumulado;
    }, {});

    expect(concedido).toEqual({
      // O perfil é do utilizador: lê, cria e actualiza. Nunca apaga.
      perfis: ['INSERT', 'SELECT', 'UPDATE'],
      // Papéis são leitura pura: ninguém se promove a si próprio.
      papeis_utilizador: ['SELECT'],
      // Catálogo: escrita concedida ao papel, restringida a curadores pela política.
      entradas_catalogo: ['DELETE', 'INSERT', 'SELECT', 'UPDATE'],
      fases_catalogo: ['DELETE', 'INSERT', 'SELECT', 'UPDATE'],
      tarefas_catalogo: ['DELETE', 'INSERT', 'SELECT', 'UPDATE'],
    });
  });
});
