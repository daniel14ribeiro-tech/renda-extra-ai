import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { esquemaEntradaCatalogo, type EntradaCatalogo } from './esquema';

const DIRECTORIO = path.join(process.cwd(), 'content/catalogo');

/**
 * As entradas de catálogo vivem em ficheiros versionados, não numa base de dados
 * editada à mão.
 *
 * É o que torna a curadoria revisível: uma alteração ao catálogo passa por diff e
 * por revisão como qualquer outra alteração. A base de dados é o destino, não a
 * fonte de verdade.
 */
export async function carregarEntradasDoConteudo(): Promise<readonly EntradaCatalogo[]> {
  const ficheiros = (await readdir(DIRECTORIO)).filter((nome) => nome.endsWith('.json')).sort();

  return Promise.all(
    ficheiros.map(async (nome) => {
      const bruto = await readFile(path.join(DIRECTORIO, nome), 'utf8');
      const resultado = esquemaEntradaCatalogo.safeParse(JSON.parse(bruto));

      if (!resultado.success) {
        const problemas = resultado.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ');
        throw new Error(`Entrada de catálogo inválida em ${nome} — ${problemas}`);
      }

      return resultado.data;
    }),
  );
}
