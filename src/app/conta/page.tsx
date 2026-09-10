import { Botao } from '@/components/ui/botao';
import { accaoTerminarSessao } from '@/features/identidade/acoes';
import { obterEstadoDaConta } from '@/features/identidade/consultas';

export const metadata = { title: 'A minha conta · Renda Extra AI' };

/**
 * Página de conta.
 *
 * Existe para que a identidade seja verificável de ponta a ponta: quem está em
 * sessão, com que papéis. Não é produto — o produto começa na Fase 2.
 */
export default async function PaginaConta() {
  const { utilizador, perfil, papeis } = await obterEstadoDaConta();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">A minha conta</h1>

      <dl className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium">{utilizador.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Nome</dt>
          <dd className="font-medium">{perfil?.nomeApresentacao ?? 'Por definir'}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Papéis</dt>
          <dd className="font-medium">{papeis.join(', ')}</dd>
        </div>
      </dl>

      <form action={accaoTerminarSessao}>
        <Botao type="submit" variante="contorno" className="w-full">
          Terminar sessão
        </Botao>
      </form>
    </main>
  );
}
