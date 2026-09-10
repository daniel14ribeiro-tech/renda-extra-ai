# Renda Extra AI

Sistema de execução que transforma capacidades subutilizadas em rendimento extra validado.
Não é um gerador de ideias: leva o utilizador de um perfil de capacidades até uma **validação real
de mercado**, com plano acompanhado.

**Idioma do projecto: português europeu (pt-PT)** — código, comentários, documentação, interface e
mensagens de commit. Identificadores de domínio em português; termos técnicos consagrados em inglês.

## Estado

**Fase 1 — Dados e Identidade, concluída.** Existe base de dados com RLS, autenticação completa e
as três primeiras entradas de catálogo. **Não existem ainda funcionalidades de produto**: não há
diagnóstico, correspondência, planos nem registo de validação.

Antes de escrever código de produto, ler `docs/produto/especificacao-v1.md`. As decisões de
arquitectura estão em `docs/adr/` e são vinculativas — para as contrariar, escreve-se um ADR novo.

## Comandos

```bash
pnpm dev            # servidor de desenvolvimento
pnpm build          # build de produção
pnpm check          # lint + formatação + tipos + testes  ← antes de qualquer commit
pnpm test           # testes
pnpm lint:fix       # corrigir o que for automático
pnpm db:gerar       # gerar migração a partir do esquema Drizzle
pnpm db:migrar      # aplicar migrações (precisa de DATABASE_URL)
```

Gestor de pacotes: **pnpm**. Node ≥ 22 (ver `.nvmrc`).

## Arquitectura

```
src/app/         rotas, layouts e route handlers — apresentação apenas
src/components/  ui/ (primitivos shadcn) e compostos partilhados
src/features/    um directório por domínio: casos de uso e regras de negócio
src/lib/         adaptadores: db, supabase, ai, payments, email, analytics, env
content/         catálogo curado, em ficheiros versionados
docs/adr/        decisões de arquitectura
docs/produto/    especificação, definições de validação, processo de curadoria
```

**Dependências num só sentido:** `app/` e `components/` → `features/` → `lib/`.
A apresentação não importa `@/lib/db`, `@/lib/ai` nem `@/lib/supabase` — o ESLint recusa.

## Regras que não se negoceiam

1. **Ambiente** — `process.env` só se lê em `src/lib/env/`. Novas variáveis entram no esquema Zod
   quando forem usadas, e no `.env.example` na secção da fase respectiva.
2. **Segredos** — nunca em `NEXT_PUBLIC_*`, nunca em mensagens de erro, nunca versionados.
3. **RLS** — toda a tabela de utilizador nasce com RLS activa **e forçada**, com teste de
   isolamento. A verificação na aplicação é a segunda linha de defesa, não a primeira. O middleware
   não é defesa nenhuma: é navegação.
4. **Acesso a dados** — todo o acesso a dados de utilizador passa por `executarComoUtilizador`.
   Uma consulta escrita fora desse invólucro corre sem RLS, porque a ligação da aplicação é
   privilegiada. Ver ADR 0014.
5. **Esquema de dados** — só muda por migração versionada. Nunca pelo painel do Supabase.
6. **IA** — só no servidor, com `import 'server-only'`. Saída sempre validada com Zod. A IA não
   escreve na base de dados nem no catálogo, e não tem privilégios que uma injecção possa aproveitar.
7. **Catálogo** — a IA personaliza e ordena; **curar é acto humano**. Ver `docs/produto/processo-curadoria.md`.
8. **Validação** — nenhum evento N1–N4 sem evidência. As regras estão em
   `docs/produto/definicoes-validacao.md` e são determinísticas e testadas.
9. **Tokens** — os componentes usam `bg-background`, `text-muted-foreground` e afins. Nunca cores
   literais.
10. **Mobile-first** — desenhar a partir de 360px. Alvos de toque com pelo menos 44px.
11. **Sem código de andaime** — o que existe no repositório corre e é testado. Estrutura por
    preencher documenta-se num README, não se simula com código que aparenta funcionar.

## Convenções

- Commits: `tipo: descrição no imperativo`, em pt-PT. Pequenos e coerentes.
- Testes junto do código (`x.ts` → `x.test.ts`), executados com `vitest`.
- Um componente usado por um só domínio vive nesse domínio, não em `components/`.
- Nada de `console.log` — o ESLint só permite `console.warn` e `console.error`.
