import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('junta classes simples', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('ignora valores falsos', () => {
    expect(cn('px-2', false, undefined, null, 'py-1')).toBe('px-2 py-1');
  });

  it('faz vencer a última classe em conflito', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('preserva classes de propriedades diferentes', () => {
    expect(cn('text-sm text-red-500', 'text-lg')).toBe('text-red-500 text-lg');
  });
});
