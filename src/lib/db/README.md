# lib/db/

Acesso a dados: esquema Drizzle, migrações versionadas e repositórios.

**Fase 1.** Nada instalado nem configurado nesta fase — nem `drizzle-orm`, nem `drizzle-kit`.

Quando for implementado:

- `schema/` — tabelas Drizzle, uma por ficheiro, reexportadas num barril
- `migrations/` — SQL versionado em Git. Nunca alterações manuais no painel do Supabase
- repositórios — a única fronteira que devolve tipos do domínio; nenhuma outra camada importa Drizzle

**RLS activa em todas as tabelas de utilizador**, com isolamento por `user_id`. A verificação de
autorização na aplicação é a segunda linha de defesa, não a primeira.
