# 0006 — Módulo de IA exclusivamente no servidor

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

A IA personaliza e ordena oportunidades a partir de dados pessoais do utilizador. Uma chave de API
exposta é uma factura aberta a terceiros; uma saída de modelo tratada como confiável é uma falha de
segurança e de correcção.

## Decisão

Todo o código de IA vive em `src/lib/ai/`, começa por `import 'server-only'`, e obedece a:

1. A chave da API nunca chega ao navegador
2. Prompts versionados em ficheiros próprios, com número de versão registado em cada chamada
3. Toda a saída do modelo é validada com Zod antes de ser usada; saída inválida é caso normal
4. **A IA não tem privilégios directos**: não escreve na base de dados nem no catálogo — devolve
   dados estruturados que outra camada valida e persiste
5. Cada chamada regista tokens, custo, latência e versão do prompt em `ai_generations`
6. As quotas por utilizador são verificadas antes da chamada
7. Conteúdo fornecido pelo utilizador é tratado como não confiável: injecção de instruções não pode
   escalar privilégios, porque o modelo não tem nenhum

## Consequências

- Custo e comportamento do modelo observáveis desde a primeira chamada, não quando a factura surpreende
- Trabalho longo é assíncrono, com estado persistido; nunca um pedido HTTP a arrastar-se
- Custo: mais camadas entre o pedido e a resposta. É o que torna o sistema auditável
