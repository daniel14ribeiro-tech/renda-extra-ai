# components/

`ui/` — primitivos do sistema de design, instalados via shadcn/ui (`pnpm dlx shadcn@latest add ...`),
copiados para o repositório e mantidos por nós. Sem lógica de negócio.

Restantes subdirectórios — componentes compostos, partilhados por mais de uma funcionalidade.
Um componente usado por um só domínio vive nesse domínio, em `features/`.

Os componentes consomem sempre tokens semânticos (`bg-background`, `text-muted-foreground`),
nunca cores literais. A paleta está em `src/app/globals.css`.

Vazio na Fase 0: o sistema de design é construído na Fase 2.
