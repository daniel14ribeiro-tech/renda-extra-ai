# 0014 — Contexto de utilizador por transacção

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

A aplicação liga-se ao Postgres com um papel privilegiado — é o que permite correr migrações e ler
dados globais. Esse papel ignora a RLS. Se o acesso a dados de utilizador usasse a ligação como
está, as políticas do ADR 0013 não protegiam nada.

## Decisão

Todo o acesso a dados de utilizador passa por `executarComoUtilizador`, que dentro de uma transacção:

1. declara o utilizador em curso em `request.jwt.claims`, que é de onde `auth.uid()` lê;
2. desce ao papel `authenticated` com `SET LOCAL ROLE`.

`SET LOCAL` é deliberado: o contexto morre com a transacção. Um contexto que ficasse agarrado à
ligação seria servido, no pedido seguinte, a outra pessoa — que é exactamente como se vazam dados
entre utilizadores em aplicações com pool de ligações.

Existe também `executarComoAnonimo`, para que a ausência de privilégios do visitante seja testável e
não apenas presumida.

## Consequências

- As políticas de RLS aplicam-se ao código da aplicação e não só a acessos externos
- Um teste verifica explicitamente que nem as claims nem o papel elevado sobrevivem à transacção
- Custo: uma transacção por operação, mesmo em leituras simples. É o preço de a RLS ser real
- **Armadilha a vigiar:** uma consulta escrita fora deste invólucro corre sem RLS. É a razão pela
  qual os repositórios são a única porta de entrada aos dados
