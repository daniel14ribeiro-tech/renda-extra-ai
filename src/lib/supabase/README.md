# lib/supabase/

Clientes Supabase: navegador, servidor e middleware de sessão.

**Fase 1.** Nada instalado nesta fase.

Regras que valem desde já:

- a chave `service_role` ignora RLS — só em código de servidor, nunca num ficheiro que o cliente possa importar
- a sessão é lida no servidor; o cliente nunca é a fonte de verdade sobre quem está autenticado
- o cliente de navegador usa exclusivamente a chave anónima
