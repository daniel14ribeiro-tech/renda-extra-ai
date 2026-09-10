import Link from 'next/link';

import { Campo, Etiqueta } from '@/components/ui/campo';
import { accaoRegistar } from '@/features/identidade/acoes';
import { FormularioAutenticacao } from '@/features/identidade/componentes/formulario-autenticacao';
import { MINIMO_PALAVRA_PASSE } from '@/features/identidade/validacao';

export const metadata = { title: 'Criar conta · Renda Extra AI' };

export default function PaginaRegistar() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>

      <FormularioAutenticacao accao={accaoRegistar} textoBotao="Criar conta">
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
            autoComplete="new-password"
            minLength={MINIMO_PALAVRA_PASSE}
            required
            aria-describedby="ajuda-palavra-passe"
          />
          <p id="ajuda-palavra-passe" className="text-sm text-muted-foreground">
            Pelo menos {MINIMO_PALAVRA_PASSE} caracteres. O comprimento protege mais do que os
            símbolos.
          </p>
        </div>
      </FormularioAutenticacao>

      <Link
        href="/entrar"
        className="text-sm text-muted-foreground underline hover:text-foreground"
      >
        Já tenho conta
      </Link>
    </>
  );
}
