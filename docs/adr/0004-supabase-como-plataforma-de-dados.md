# 0004 — Supabase como plataforma de dados e autenticação

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

O produto precisa de Postgres, autenticação, armazenamento de ficheiros e isolamento de dados entre
utilizadores. A equipa é pequena e não tem capacidade para operar infraestrutura.

## Decisão

Supabase: Postgres gerido, Auth, Storage e RLS.

**RLS activa em todas as tabelas de utilizador, sem excepção**, com isolamento por `user_id`. A
verificação de autorização na camada de serviço é a segunda linha de defesa, nunca a primeira.

A chave `service_role` ignora RLS: só em código de servidor, nunca importável pelo cliente.

## Consequências

- Menos código de infraestrutura e uma linha de defesa que resiste a erros da aplicação
- **Risco principal:** RLS mal configurada é a falha mais comum e mais grave em produtos assentes
  nesta plataforma. Mitigação: testes automáticos de isolamento entre utilizadores desde a Fase 1,
  tratados como testes de segurança e não como testes de funcionalidade
- Dependência de fornecedor mitigada por usar Postgres puro e Drizzle: o esquema e os dados são portáveis
