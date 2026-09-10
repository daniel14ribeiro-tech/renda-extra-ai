# 0010 — Estratégia de testes por fase

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Uma equipa pequena não sustenta cobertura uniforme. Testar tudo por igual esgota o orçamento em
código trivial e deixa a descoberto o que causa danos reais.

## Decisão

Vitest como executor. A cobertura segue o risco, não a linha de código:

| Prioridade | O que                                             | Quando |
| ---------- | ------------------------------------------------- | ------ |
| Máxima     | Isolamento entre utilizadores (RLS)               | Fase 1 |
| Máxima     | Regras de validação N1–N4 e invariantes de evento | Fase 3 |
| Alta       | Filtro determinístico de elegibilidade            | Fase 3 |
| Alta       | Validação da saída do modelo e quotas             | Fase 3 |
| Média      | Componentes de UI com lógica condicional          | Fase 2 |
| Baixa      | Componentes de apresentação pura                  | —      |

Testes ponta a ponta (Playwright) entram na **Fase 5**, cobrindo apenas os caminhos críticos:
autenticação, escolha de oportunidade e registo de validação. Não são instalados antes disso —
não há caminhos para percorrer.

## Consequências

- Na Fase 0 há testes para o que existe: validação de ambiente e utilitários
- Testes de isolamento entre utilizadores são tratados como testes de segurança: falham o build
- Custo: cobertura desigual por desenho. A alternativa é cobertura uniformemente medíocre
