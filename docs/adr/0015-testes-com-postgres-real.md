# 0015 — Testes de base de dados com Postgres real em memória

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Testes de isolamento entre utilizadores só valem alguma coisa se exercitarem as políticas de RLS a
sério. Imitar a base de dados testaria a imitação. Um serviço Postgres em CI funciona, mas torna os
testes dependentes de infraestrutura e mais lentos a arrancar.

## Decisão

Os testes de dados correm contra **PGlite**, um Postgres real compilado para WebAssembly, em
memória. As migrações são aplicadas a partir do jornal, pela mesma ordem que em produção.

O ambiente de teste recria a superfície mínima do Supabase de que o esquema depende: os papéis
`anon` e `authenticated`, a tabela `auth.users` a que as chaves estrangeiras apontam, e `auth.uid()`
com a mesma implementação — ler o `sub` das claims declaradas na sessão.

## Consequências

- As políticas exercitadas nos testes são as que vão para produção, e não uma aproximação
- Os testes correm em qualquer máquina e em CI sem serviços, contentores ou credenciais
- Uma migração que não corra faz os testes não correrem: a suite é também a auditoria das migrações
- **Divergência conhecida:** o PGlite acompanha uma versão do Postgres que pode não ser a do
  projecto Supabase. Vale para RLS, políticas, privilégios e tipos; não substitui verificação em
  ambiente real antes de uma migração destrutiva
- Não é recriado nada do Supabase para lá do que o esquema exige. Não é um simulador do fornecedor
