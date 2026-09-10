# 0002 — Next.js 16 com App Router e TypeScript estrito

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

O produto é uma aplicação web mobile-first com lógica sensível (correspondência, IA, dados pessoais)
que não pode viver no navegador. Precisa de renderização no servidor, de uma fronteira
cliente/servidor clara, e de uma equipa pequena a conseguir mantê-la.

## Decisão

Next.js 16 com App Router, React 19 e TypeScript em modo estrito, num único repositório para web e API.

Além de `strict`, ficam activas: `noUncheckedIndexedAccess`, `noImplicitOverride`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters` e
`verbatimModuleSyntax`.

`exactOptionalPropertyTypes` fica **desactivada**: entra em conflito frequente com a propagação de
propriedades de componentes de terceiros, e o custo em atrito excede o que acrescenta a um código
que já corre com as opções acima. Reavaliar se o padrão de componentes o permitir.

## Consequências

- Os Server Components mantêm chaves e lógica sensível fora do pacote enviado ao cliente
- `noUncheckedIndexedAccess` obriga a tratar acessos por índice como possivelmente indefinidos:
  mais verboso, e a razão pela qual uma classe inteira de erros não chega a produção
- Ficamos sujeitos ao ritmo de alterações do Next; mitigado por manter a lógica de negócio em
  `features/`, sem dependência do framework
