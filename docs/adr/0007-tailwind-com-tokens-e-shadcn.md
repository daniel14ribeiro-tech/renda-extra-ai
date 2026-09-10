# 0007 — Tailwind com tokens semânticos e shadcn/ui

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

O produto tem de parecer premium e funcionar bem em telemóvel. Uma biblioteca de componentes fechada
dá arranque rápido e um tecto baixo: mais tarde luta-se contra ela para conseguir o acabamento.

## Decisão

Tailwind CSS 4 com uma camada de tokens semânticos em `src/app/globals.css`, e componentes shadcn/ui
copiados para o repositório (sobre Radix, que garante acessibilidade e comportamento de teclado).

Os componentes consomem sempre tokens (`bg-background`, `text-muted-foreground`), nunca valores
literais. Trocar a paleta é editar um ficheiro.

## Consequências

- Controlo total sobre o acabamento: os componentes são nossos, não de uma dependência
- Acessibilidade herdada dos primitivos Radix em vez de reimplementada
- Custo: manutenção dos componentes copiados é nossa; correcções a montante não chegam sozinhas
- Modo escuro por token desde o início, sem reescrita posterior
