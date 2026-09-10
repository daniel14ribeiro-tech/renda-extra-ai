# features/

Um directório por domínio do produto (`diagnostico/`, `catalogo/`, `correspondencia/`,
`planos/`, `validacao/`). Cada um contém os casos de uso desse domínio: as regras de negócio,
a orquestração e a validação de entrada.

**Regra de dependências, imposta pelo ESLint:**

```
app/ e components/  →  features/  →  lib/
```

A camada de apresentação não fala com a base de dados nem com a IA. Sempre por aqui.

Vazio na Fase 0 por desenho: a Fase 0 não constrói funcionalidades.
