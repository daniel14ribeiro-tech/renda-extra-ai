# 0011 — pt-PT exclusivo, sem i18n no v1

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

O catálogo de oportunidades é específico de Portugal: enquadramento fiscal, plataformas, valores de
mercado, obrigações legais. Traduzir a interface sem traduzir o catálogo não abre mercado nenhum.

## Decisão

O v1 serve Portugal, em português europeu. Nenhuma infraestrutura de internacionalização é
instalada: sem biblioteca de i18n, sem segmento de idioma nas rotas, sem ficheiros de tradução.

O texto da interface fica junto dos componentes que o usam.

## Consequências

- Menos uma camada de indirecção em cada peça de texto durante toda a construção do v1
- **Custo assumido:** acrescentar um segundo mercado obrigará a percorrer a interface inteira. É
  trabalho conhecido e a decisão é deliberada — o custo real de expandir está no catálogo, não no texto
- O `lang` do documento é `pt-PT`, e as datas e valores usam as convenções locais
