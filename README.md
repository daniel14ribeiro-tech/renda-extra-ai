# Renda Extra AI

Sistema de execução para transformar capacidades subutilizadas em rendimento extra **validado por
mercado real** — não um gerador de listas de ideias.

O produto leva o utilizador por um percurso fechado: diagnóstico de capacidades → correspondência
com um catálogo curado de oportunidades → escolha de **uma** → plano de execução → registo de
validação real → revisão semanal.

A métrica que orienta o produto é o **tempo até à primeira validação real (TTV)**, tendo a primeira
venda como marco comercial principal.

## Estado

> **Fase 1 — Dados e Identidade, concluída.** Há base de dados com RLS activa e forçada,
> autenticação completa e as três primeiras entradas de catálogo, em rascunho.
>
> **Ainda não há produto:** não existe diagnóstico, correspondência com oportunidades, planos
> nem registo de validação. Isso começa na Fase 2.

## Stack

| Camada    | Escolha                                                          |
| --------- | ---------------------------------------------------------------- |
| Aplicação | Next.js 16 (App Router), React 19, TypeScript estrito            |
| Interface | Tailwind CSS 4 com tokens semânticos, shadcn/ui sobre Radix      |
| Dados     | Supabase (Postgres, Auth, RLS, Storage) com Drizzle — **Fase 1** |
| IA        | API Anthropic, exclusivamente no servidor — **Fase 3**           |
| Qualidade | ESLint, Prettier, husky, lint-staged, Vitest, GitHub Actions     |

Pagamentos, email e análise continuam sem SDK instalado e sem serviço contratado —
ver [ADR 0012](./docs/adr/0012-fase-0-sem-sdks-de-terceiros.md).

## Arranque

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Node ≥ 22 (ver `.nvmrc`), pnpm 10.

## Verificação

```bash
pnpm check   # lint + formatação + tipos + testes
pnpm build
```

A mesma sequência corre em integração contínua a cada push.

## Documentação

| Documento                                                         | Conteúdo                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------- |
| [Especificação v1](./docs/produto/especificacao-v1.md)            | Premissa, métrica-norte, fluxo central, ecrãs, modelo de dados |
| [Definições de validação](./docs/produto/definicoes-validacao.md) | N1–N4 por tipo de oportunidade, observáveis e testáveis        |
| [Processo de curadoria](./docs/produto/processo-curadoria.md)     | Papéis, estados, cadência de revisão, fila de candidatas       |
| [Decisões de arquitectura](./docs/adr/)                           | 12 ADRs                                                        |
| [CLAUDE.md](./CLAUDE.md)                                          | Convenções e regras de desenvolvimento                         |
