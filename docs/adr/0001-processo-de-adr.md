# 0001 — Processo de registo de decisões

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Decisões de arquitectura tomadas em conversa perdem-se. Meses depois ninguém sabe se uma escolha foi
deliberada ou acidental, e o custo de a rever é pago em discussões repetidas.

## Decisão

Toda a decisão com consequências duradouras — stack, fronteiras, segurança, dados — fica registada
num ADR numerado em `docs/adr/`, com contexto, decisão e consequências.

Um ADR não se reescreve. Uma decisão revertida ganha o estado "substituída" e aponta para a que a
substitui, preservando o raciocínio original.

## Consequências

- Decisões passam a ser auditáveis e revisíveis com o contexto que as originou
- Custo: alguns minutos por decisão; a alternativa é redescobrir o mesmo argumento várias vezes
- Decisões de produto vivem em `docs/produto/`, não aqui: são domínios diferentes
