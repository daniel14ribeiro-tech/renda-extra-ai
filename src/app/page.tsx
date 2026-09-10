/**
 * Página de estado da fundação.
 *
 * Não representa o produto. Existe para que a aplicação tenha uma rota renderizável
 * enquanto não houver funcionalidades — será substituída na Fase 2.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 px-5 py-12">
      <p className="text-sm tracking-wide text-muted-foreground uppercase">Fase 0 — Fundação</p>
      <h1 className="text-3xl font-semibold tracking-tight">Renda Extra AI</h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Ainda não existem funcionalidades. Este repositório contém, nesta fase, apenas a fundação
        técnica: estrutura, qualidade, testes e integração contínua.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        A especificação do produto está em <code className="font-mono">docs/produto/</code> e as
        decisões de arquitectura em <code className="font-mono">docs/adr/</code>.
      </p>
    </main>
  );
}
