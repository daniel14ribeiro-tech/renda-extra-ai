# 0008 — Validação de ambiente no arranque

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Variáveis de ambiente em falta ou mal formadas falham tarde: um `undefined` propaga-se e rebenta a
meio de um pedido em produção, longe da causa. E mensagens de erro sobre segredos acabam nos registos.

## Decisão

O ambiente é validado com Zod uma vez, no arranque, em `src/lib/env/`. Um processo com ambiente
inválido falha antes de servir tráfego.

Três regras:

1. `process.env` só é legível dentro de `src/lib/env/` — imposto pelo ESLint
2. `server.ts` importa `server-only`: uma fuga de ambiente de servidor para o cliente é erro de compilação
3. As mensagens de erro **redigem o valor recebido**. Uma chave mal formada não viaja para os
   registos dentro do erro que a denuncia. Comportamento coberto por testes

Cada fase acrescenta as suas variáveis, e só quando forem realmente usadas.

## Consequências

- Falhas de configuração aparecem no arranque, com todos os problemas listados de uma vez
- Tipos derivados do esquema: ler uma variável inexistente é erro de compilação
- Custo: uma indirecção para ler configuração. Trivial face ao que evita
