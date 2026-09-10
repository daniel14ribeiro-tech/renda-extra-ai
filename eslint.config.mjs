import next from 'eslint-config-next/core-web-vitals';

/**
 * Regras de qualidade e de fronteira arquitectural.
 *
 * As restrições de importação abaixo não são estilo: são a arquitectura em camadas
 * tornada verificável. Ver docs/adr/0003-arquitectura-em-camadas.md.
 */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'next-env.d.ts', 'pnpm-lock.yaml'],
  },

  ...next,

  {
    name: 'renda-extra/base',
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-implicit-coercion': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-const': ['error', { destructuring: 'all' }],
      // O ambiente é lido e validado num único sítio; em mais nenhum.
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Não leias process.env directamente. Importa de @/lib/env/server ou @/lib/env/client.',
        },
      ],
    },
  },

  {
    // As regras com plugin de TypeScript só existem onde o plugin se aplica.
    name: 'renda-extra/typescript',
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    name: 'renda-extra/fronteiras-de-camada',
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/lib/db',
                '@/lib/db/*',
                '@/lib/ai',
                '@/lib/ai/*',
                '@/lib/supabase',
                '@/lib/supabase/*',
              ],
              message:
                'A camada de apresentação não fala com dados, IA nem fornecedor. Passa por src/features/<dominio>.',
            },
          ],
        },
      ],
    },
  },

  {
    name: 'renda-extra/modulo-de-ambiente',
    files: ['src/lib/env/**/*.ts', '*.config.{ts,mjs}'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
];

export default config;
