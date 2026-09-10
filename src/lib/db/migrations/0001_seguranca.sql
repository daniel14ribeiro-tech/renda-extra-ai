-- Endurecimento de segurança que o gerador de esquema não exprime.
--
-- Duas coisas acontecem aqui:
--   1. FORCE ROW LEVEL SECURITY — a RLS passa a aplicar-se também ao dono da tabela.
--      Sem isto, qualquer ligação feita como dono ignora silenciosamente as políticas.
--      Papéis com BYPASSRLS (a role de serviço) continuam a passar, por desenho.
--   2. Privilégios mínimos por tabela. As políticas dizem "que linhas"; os GRANT dizem
--      "que operações". Sem GRANT, a política nunca chega a ser avaliada.
--
-- Os papéis `anon` e `authenticated` são criados pelo Supabase e não por nós.

ALTER TABLE "perfis" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "papeis_utilizador" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "entradas_catalogo" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "fases_catalogo" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tarefas_catalogo" FORCE ROW LEVEL SECURITY;--> statement-breakpoint

-- Ponto de partida: nada. Cada privilégio abaixo é concedido deliberadamente.
REVOKE ALL ON ALL TABLES IN SCHEMA "public" FROM "anon", "authenticated";--> statement-breakpoint
GRANT USAGE ON SCHEMA "public" TO "anon", "authenticated";--> statement-breakpoint

-- Perfil: o utilizador lê, cria e actualiza o seu. Não apaga — apagar a conta
-- faz-se em auth.users e cascateia para aqui.
GRANT SELECT, INSERT, UPDATE ON "perfis" TO "authenticated";--> statement-breakpoint

-- Papéis: leitura apenas. Um utilizador nunca se promove a si próprio, e não há
-- política de escrita que o permitisse mesmo que o privilégio existisse.
GRANT SELECT ON "papeis_utilizador" TO "authenticated";--> statement-breakpoint

-- Catálogo: a escrita é gated pelas políticas de curador. O privilégio é concedido
-- ao papel `authenticated` porque é sob esse papel que um curador se liga; quem não
-- for curador é recusado pela política, não pelo privilégio.
GRANT SELECT, INSERT, UPDATE, DELETE ON "entradas_catalogo" TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "fases_catalogo" TO "authenticated";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "tarefas_catalogo" TO "authenticated";--> statement-breakpoint

-- `anon` (visitante não autenticado) não recebe nada. Nenhuma tabela deste esquema
-- tem conteúdo público.
