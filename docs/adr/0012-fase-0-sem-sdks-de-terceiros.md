# 0012 — Fase 0 sem SDKs de terceiros

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

É tentador instalar na fundação tudo o que se sabe que virá: Drizzle, Supabase, Anthropic, Stripe,
Resend. O resultado é um repositório com dependências que ninguém usa, versões que envelhecem antes
da primeira linha de código que as invoca, e código de andaime que aparenta funcionar sem funcionar.

## Decisão

A Fase 0 instala apenas o que corre: Next, React, Zod, Tailwind e a linha de qualidade. Nenhum SDK
de base de dados, IA, pagamentos, email ou análise.

A preparação para essas integrações é feita com estrutura e contratos — um directório por módulo,
com um README que fixa as regras que valem quando a fase chegar — e com as variáveis de ambiente
documentadas por fase em `.env.example`, comentadas até serem necessárias.

Nenhum serviço pago é contratado nesta fase.

## Consequências

- O repositório não contém código que finja funcionar. O que existe, corre e é testado
- Cada SDK é instalado na versão actual no momento em que passa a ser usado
- Custo: a Fase 1 começa com um passo de instalação. Trivial
- **Nota de ferramentas:** o ESLint está fixado na linha 9. A 10 é incompatível com o
  eslint-config-next 16.3.4 (o eslint-plugin-react e o gestor de âmbito de ficheiros JS usam APIs
  removidas). Revisitar quando o eslint-config-next suportar a linha 10
