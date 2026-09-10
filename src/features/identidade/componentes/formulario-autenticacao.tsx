'use client';

import { useActionState } from 'react';

import { Botao } from '@/components/ui/botao';
import { ESTADO_INICIAL, type EstadoFormulario } from '@/features/identidade/fluxos';

type Accao = (anterior: EstadoFormulario, formulario: FormData) => Promise<EstadoFormulario>;

/**
 * Envelope comum aos formulários de autenticação: estado pendente, mensagens de
 * erro e de aviso. Os campos são passados como filhos, porque é a única coisa que
 * varia de formulário para formulário.
 */
export function FormularioAutenticacao({
  accao,
  textoBotao,
  children,
}: {
  accao: Accao;
  textoBotao: string;
  children: React.ReactNode;
}) {
  const [estado, executar, pendente] = useActionState(accao, ESTADO_INICIAL);

  return (
    <form action={executar} className="flex flex-col gap-4">
      {children}

      {estado.estado === 'erro' && (
        <p role="alert" className="text-sm text-destructive">
          {estado.mensagem}
        </p>
      )}

      {estado.estado === 'aviso' && (
        <p role="status" className="text-sm text-muted-foreground">
          {estado.mensagem}
        </p>
      )}

      <Botao type="submit" disabled={pendente}>
        {pendente ? 'A processar…' : textoBotao}
      </Botao>
    </form>
  );
}
