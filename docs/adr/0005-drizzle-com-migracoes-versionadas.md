# 0005 — Drizzle com migrações versionadas em Git

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Plataformas com painel de administração convidam a alterar o esquema pela interface. O resultado é
divergência entre ambientes e um esquema cuja história ninguém consegue reconstituir.

## Decisão

Drizzle ORM com migrações SQL versionadas em Git. **Nenhuma alteração de esquema é feita pelo painel
do Supabase.** O que não está numa migração não existe.

Tipos do esquema derivam do próprio esquema, sem duplicação manual.

## Consequências

- O esquema tem história, revisão e possibilidade de reversão como qualquer outro código
- Ambientes reproduzíveis; um ambiente novo levanta-se a partir do repositório
- Custo: alterações rápidas deixam de ser rápidas. É o objectivo
- Ficheiros gerados são regenerados pela ferramenta, nunca editados à mão
