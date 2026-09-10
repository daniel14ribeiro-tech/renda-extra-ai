# 0003 — Arquitectura em camadas imposta por lint

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Em aplicações Next é fácil e tentador chamar a base de dados directamente de um componente. Funciona
no início e torna-se impossível de testar, de auditar e de mudar depois.

## Decisão

Três camadas, com dependências num só sentido:

```
app/ (rotas, UI)  →  features/<dominio>/ (casos de uso)  →  lib/ (adaptadores: db, ai, email, ...)
```

A regra não fica num documento: fica no ESLint. `src/app/**` e `src/components/**` não podem importar
`@/lib/db` nem `@/lib/ai`. Uma violação é um erro de lint, não uma observação em revisão de código.

## Consequências

- A lógica de negócio é testável sem renderizar componentes nem levantar um servidor
- Trocar de fornecedor de IA ou de base de dados fica contido em `lib/`
- Custo: uma indirecção a mais em operações triviais. Aceite — o caso trivial é o raro
- Regras análogas serão acrescentadas à medida que novas fronteiras aparecerem
