import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function Campo({ className, ...resto }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50',
        className,
      )}
      {...resto}
    />
  );
}

export function Etiqueta({ className, ...resto }: ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium text-foreground', className)} {...resto} />;
}
