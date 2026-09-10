import Link from 'next/link';

import { Campo, Etiqueta } from '@/components/ui/campo';
import { accaoRecuperarAcesso } from '@/features/identidade/acoes';
import { FormularioAutenticacao } from '@/features/identidade/componentes/formulario-autenticacao';

export const metadata = { title: 'Recuperar acesso · Renda Extra AI' };

export default function PaginaRecuperarAcesso() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Recuperar acesso</h1>
      <p className="text-sm text-muted-foreground">
        Escreve o teu email e enviamos-te as instruções para definires uma nova palavra-passe.
      </p>

      <FormularioAutenticacao accao={accaoRecuperarAcesso} textoBotao="Enviar instruções">
        <div className="flex flex-col gap-2">
          <Etiqueta htmlFor="email">Email</Etiqueta>
          <Campo id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </FormularioAutenticacao>

      <Link
        href="/entrar"
        className="text-sm text-muted-foreground underline hover:text-foreground"
      >
        Voltar a entrar
      </Link>
    </>
  );
}
