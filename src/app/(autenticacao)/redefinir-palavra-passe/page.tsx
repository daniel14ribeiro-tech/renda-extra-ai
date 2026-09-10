import { Campo, Etiqueta } from '@/components/ui/campo';
import { accaoDefinirPalavraPasse } from '@/features/identidade/acoes';
import { FormularioAutenticacao } from '@/features/identidade/componentes/formulario-autenticacao';
import { MINIMO_PALAVRA_PASSE } from '@/features/identidade/validacao';

export const metadata = { title: 'Nova palavra-passe · Renda Extra AI' };

export default function PaginaRedefinirPalavraPasse() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Definir nova palavra-passe</h1>

      <FormularioAutenticacao accao={accaoDefinirPalavraPasse} textoBotao="Guardar">
        <div className="flex flex-col gap-2">
          <Etiqueta htmlFor="palavraPasse">Nova palavra-passe</Etiqueta>
          <Campo
            id="palavraPasse"
            name="palavraPasse"
            type="password"
            autoComplete="new-password"
            minLength={MINIMO_PALAVRA_PASSE}
            required
          />
        </div>
      </FormularioAutenticacao>
    </>
  );
}
