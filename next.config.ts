import type { NextConfig } from 'next';

/**
 * Cabeçalhos de segurança aplicados a todas as respostas.
 *
 * A Content-Security-Policy não está aqui deliberadamente: exige nonce por pedido e
 * conhecimento das origens de terceiros que só existirão a partir da Fase 3.
 * Ver docs/adr/0009-cabecalhos-de-seguranca.md.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  headers: () =>
    Promise.resolve([
      {
        source: '/:path*',
        headers: securityHeaders.map((header) => ({ ...header })),
      },
    ]),
};

export default nextConfig;
