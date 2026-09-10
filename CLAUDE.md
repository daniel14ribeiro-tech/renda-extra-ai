# Renda Extra AI

Sistema de execução que transforma capacidades subutilizadas em rendimento extra validado.
Não é um gerador de ideias: leva o utilizador de um perfil de capacidades até uma **validação real
de mercado**, com plano acompanhado.

**Idioma do projecto: português europeu (pt-PT)** — código, comentários, documentação, interface e
mensagens de commit. Identificadores de domínio em português; termos técnicos consagrados em inglês.

## Estado

**Fase 0 — Fundação, concluída.** Não existem funcionalidades de negócio. O que está no repositório
é estrutura, qualidade, testes e integração contínua.

Antes de escrever código de produto, ler `docs/produto/especificacao-v1.md`. As decisões de
arquitectura estão em `docs/adr/` e são vinculativas — para as contrariar, escreve-se um ADR novo.

## Comandos

```bash
pnpm dev            # servidor de desenvolvimento
pnpm build          # build de produção
pnpm check          # lint + formatação + tipos + testes  ← antes de qualquer commit
pnpm test           # testes
pnpm lint:fix       # corrigir o que for automático
```

Gestor de pacotes: **pnpm**. Node ≥ 22 (ver `.nvmrc`).

## Arquitectura

```
src/app/         rotas, layouts e route handlers — apresentação apenas
src/components/  ui/ (primitivos shadcn) e compostos partilhados
src/features/    um directório por domínio: casos de uso e regras de negócio
src/lib/         adaptadores: db, supabase, ai, payments, email, analytics, env
docs/adr/        decisões de arquitectura
docs/produto/    especificação, definições de validação, processo de curadoria
```

**Dependências num só sentido:** `app/` e `components/` → `features/` → `lib/`.
A apresentação não importa `@/lib/db` nem `@/lib/ai` — o ESLint recusa.

## Regras que não se negoceiam

1. **Ambiente** — `process.env` só se lê em `src/lib/env/`. Novas variáveis entram no esquema Zod
   quando forem usadas, e no `.env.example` na secção da fase respectiva.
2. **Segredos** — nunca em `NEXT_PUBLIC_*`, nunca em mensagens de erro, nunca versionados.
3. **RLS** — toda a tabela de utilizador nasce com RLS activa e teste de isolamento. A verificação na
   aplicação é a segunda linha de defesa, não a primeira.
4. **Esquema de dados** — só muda por migração versionada. Nunca pelo painel do Supabase.
5. **IA** — só no servidor, com `import 'server-only'`. Saída sempre validada com Zod. A IA não
   escreve na base de dados nem no catálogo, e não tem privilégios que uma injecção possa aproveitar.
6. **Catálogo** — a IA personaliza e ordena; **curar é acto humano**. Ver `docs/produto/processo-curadoria.md`.
7. **Validação** — nenhum evento N1–N4 sem evidência. As regras estão em
   `docs/produto/definicoes-validacao.md` e são determinísticas e testadas.
8. **Tokens** — os componentes usam `bg-background`, `text-muted-foreground` e afins. Nunca cores
   literais.
9. **Mobile-first** — desenhar a partir de 360px. Alvos de toque com pelo menos 44px.
10. **Sem código de andaime** — o que existe no repositório corre e é testado. Estrutura por
    preencher documenta-se num README, não se simula com código que aparenta funcionar.

## Convenções

- Commits: `tipo: descrição no imperativo`, em pt-PT. Pequenos e coerentes.
- Testes junto do código (`x.ts` → `x.test.ts`), executados com `vitest`.
- Um componente usado por um só domínio vive nesse domínio, não em `components/`.
- Nada de `console.log` — o ESLint só permite `console.warn` e `console.error`.
