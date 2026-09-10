CREATE TYPE "public"."classe_volatilidade" AS ENUM('alta', 'media', 'baixa');--> statement-breakpoint
CREATE TYPE "public"."estado_curadoria" AS ENUM('rascunho', 'em_revisao', 'publicado', 'em_atualizacao', 'arquivado');--> statement-breakpoint
CREATE TYPE "public"."fase_playbook" AS ENUM('preparacao', 'exposicao', 'conversao');--> statement-breakpoint
CREATE TYPE "public"."nivel_dificuldade" AS ENUM('iniciante', 'intermedio', 'avancado');--> statement-breakpoint
CREATE TYPE "public"."nivel_validacao" AS ENUM('n0', 'n1', 'n2', 'n3', 'n4');--> statement-breakpoint
CREATE TYPE "public"."papel_utilizador" AS ENUM('utilizador', 'curador', 'administrador');--> statement-breakpoint
CREATE TYPE "public"."tipo_oportunidade" AS ENUM('t1', 't2', 't3', 't4', 't5', 't6');--> statement-breakpoint
CREATE TABLE "papeis_utilizador" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utilizador_id" uuid NOT NULL,
	"papel" "papel_utilizador" NOT NULL,
	"atribuido_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "papeis_utilizador_unico" UNIQUE("utilizador_id","papel")
);
--> statement-breakpoint
ALTER TABLE "papeis_utilizador" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "perfis" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome_apresentacao" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "perfis" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entradas_catalogo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referencia" text NOT NULL,
	"titulo" text NOT NULL,
	"tipo" "tipo_oportunidade" NOT NULL,
	"cliente_alvo" text NOT NULL,
	"problema" text NOT NULL,
	"solucao" text NOT NULL,
	"pre_requisitos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"competencias" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"canais_teste" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"riscos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tempo_semanal_minimo_horas" integer NOT NULL,
	"tempo_notas" text,
	"investimento_inicial_notas" text NOT NULL,
	"dificuldade" "nivel_dificuldade" NOT NULL,
	"validacao" jsonb NOT NULL,
	"requisitos_legais" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faixa_rendimento_mensal" jsonb,
	"pendencias_verificacao" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"fontes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estado" "estado_curadoria" DEFAULT 'rascunho' NOT NULL,
	"classe_volatilidade" "classe_volatilidade" NOT NULL,
	"curador" text NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"data_ultima_revisao" date NOT NULL,
	"data_proxima_revisao" date NOT NULL,
	"motivo_arquivo" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entradas_catalogo_referencia_unique" UNIQUE("referencia")
);
--> statement-breakpoint
ALTER TABLE "entradas_catalogo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fases_catalogo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entrada_id" uuid NOT NULL,
	"ordem" integer NOT NULL,
	"fase" "fase_playbook" NOT NULL,
	"objetivo" text NOT NULL,
	"nivel_alvo" "nivel_validacao" NOT NULL,
	CONSTRAINT "fases_catalogo_ordem_unica" UNIQUE("entrada_id","ordem")
);
--> statement-breakpoint
ALTER TABLE "fases_catalogo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tarefas_catalogo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fase_id" uuid NOT NULL,
	"ordem" integer NOT NULL,
	"acao" text NOT NULL,
	"criterio_conclusao" text NOT NULL,
	"esforco_minutos" integer NOT NULL,
	CONSTRAINT "tarefas_catalogo_ordem_unica" UNIQUE("fase_id","ordem")
);
--> statement-breakpoint
ALTER TABLE "tarefas_catalogo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "papeis_utilizador" ADD CONSTRAINT "papeis_utilizador_utilizador_id_users_id_fk" FOREIGN KEY ("utilizador_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perfis" ADD CONSTRAINT "perfis_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fases_catalogo" ADD CONSTRAINT "fases_catalogo_entrada_id_entradas_catalogo_id_fk" FOREIGN KEY ("entrada_id") REFERENCES "public"."entradas_catalogo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas_catalogo" ADD CONSTRAINT "tarefas_catalogo_fase_id_fases_catalogo_id_fk" FOREIGN KEY ("fase_id") REFERENCES "public"."fases_catalogo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "papeis_ler_proprios" ON "papeis_utilizador" AS PERMISSIVE FOR SELECT TO "authenticated" USING (utilizador_id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "perfis_ler_proprio" ON "perfis" AS PERMISSIVE FOR SELECT TO "authenticated" USING (id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "perfis_inserir_proprio" ON "perfis" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "perfis_actualizar_proprio" ON "perfis" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "entradas_ler_publicadas" ON "entradas_catalogo" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("entradas_catalogo".estado in ('publicado', 'em_atualizacao') or exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));--> statement-breakpoint
CREATE POLICY "entradas_curador_escreve" ON "entradas_catalogo" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
)) WITH CHECK (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));--> statement-breakpoint
CREATE POLICY "fases_ler_publicadas" ON "fases_catalogo" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
        select 1 from "entradas_catalogo" e
        where e.id = entrada_id and "e".estado in ('publicado', 'em_atualizacao')
      ) or exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));--> statement-breakpoint
CREATE POLICY "fases_curador_escreve" ON "fases_catalogo" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
)) WITH CHECK (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));--> statement-breakpoint
CREATE POLICY "tarefas_ler_publicadas" ON "tarefas_catalogo" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
        select 1 from "fases_catalogo" f
        join "entradas_catalogo" e on e.id = f.entrada_id
        where f.id = fase_id and "e".estado in ('publicado', 'em_atualizacao')
      ) or exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));--> statement-breakpoint
CREATE POLICY "tarefas_curador_escreve" ON "tarefas_catalogo" AS PERMISSIVE FOR ALL TO "authenticated" USING (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
)) WITH CHECK (exists (
  select 1 from "papeis_utilizador" p
  where p.utilizador_id = (select auth.uid()) and p.papel in ('curador', 'administrador')
));