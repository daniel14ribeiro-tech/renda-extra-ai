# lib/ai/

Módulo de IA. Exclusivamente do lado do servidor — ver `docs/adr/0006-modulo-de-ia-server-side.md`.

**Fase 3.** O SDK não está instalado nesta fase.

Contrato a respeitar quando for implementado:

- todos os ficheiros começam por `import 'server-only'`; a chave da API nunca chega ao navegador
- prompts versionados em ficheiros próprios, nunca interpolados à solta no código
- toda a saída do modelo é validada com Zod antes de ser usada; saída inválida é caso normal, não excepção
- a IA não escreve na base de dados nem no catálogo: devolve dados estruturados que outra camada persiste
- cada chamada regista tokens, custo, latência e versão do prompt em `ai_generations`
- as quotas por utilizador são verificadas antes da chamada, não depois
