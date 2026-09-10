import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/**
 * Alvo de toque de 44px na variante base: é o mínimo utilizável num telemóvel,
 * e este produto é desenhado a partir do telemóvel.
 */
const variantesBotao = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variante: {
        primario: 'bg-primary text-primary-foreground hover:opacity-90',
        contorno: 'border border-border bg-transparent hover:bg-muted',
        discreto: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      tamanho: {
        base: 'h-11 px-5 py-2.5',
        pequeno: 'h-9 px-3 text-sm',
      },
    },
    defaultVariants: { variante: 'primario', tamanho: 'base' },
  },
);

export type PropriedadesBotao = ComponentProps<'button'> & VariantProps<typeof variantesBotao>;

export function Botao({ className, variante, tamanho, ...resto }: PropriedadesBotao) {
  return <button className={cn(variantesBotao({ variante, tamanho }), className)} {...resto} />;
}

export { variantesBotao };
