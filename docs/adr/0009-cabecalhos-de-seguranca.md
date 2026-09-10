# 0009 — Cabeçalhos de segurança e adiamento da CSP

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Cabeçalhos de segurança custam pouco e evitam classes inteiras de ataque. A Content-Security-Policy
é o mais valioso e o mais difícil: exige nonce por pedido e conhecer todas as origens de terceiros.

## Decisão

Aplicar desde já, a todas as respostas: `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, e desligar o cabeçalho
`X-Powered-By`.

**A CSP fica deliberadamente adiada para a Fase 5**, quando as origens de terceiros forem conhecidas.
Uma CSP escrita agora seria adivinhada, e uma CSP permissiva de mais dá falsa segurança.

## Consequências

- Protecção básica desde o primeiro commit, sem esperar por decisões futuras
- **Dívida assumida e datada:** a Fase 5 não fecha sem CSP com nonce. Registada aqui para não se perder
- Adicionar um serviço de terceiros passa a exigir revisitar este ADR
