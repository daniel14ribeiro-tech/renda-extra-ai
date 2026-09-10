import Link from 'next/link';

import { Campo, Etiqueta } from '@/components/ui/campo';
import { accaoEntrar } from '@/features/identidade/acoes';
import { FormularioAutenticacao } from '@/features/identidade/componentes/formulario-autenticacao';
import { destinoSeguro } from '@/features/identidade/rotas';

export const metadata = { title: 'Entrar · Renda Extra AI' };

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ regressar?: string }>;
}) {
  const { regressar } = await searchParams;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>

      <FormularioAutenticacao accao={accaoEntrar} textoBotao="Entrar">
        <input type="hidden" name="regressar" value={destinoSeguro(regressar)} />

        <div className="flex flex-col gap-2">
          <Etiqueta htmlFor="email">Email</Etiqueta>
          <Campo id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="flex flex-col gap-2">
          <Etiqueta htmlFor="palavraPasse">Palavra-passe</Etiqueta>
          <Campo
            id="palavraPasse"
            name="palavraPasse"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      </FormularioAutenticacao>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <Link href="/recuperar-acesso" className="underline hover:text-foreground">
          Esqueci-me da palavra-passe
        </Link>
        <Link href="/registar" className="underline hover:text-foreground">
          Ainda não tenho conta
        </Link>
      </div>
    </>
  );
}
