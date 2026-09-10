# 0013 — RLS como defesa principal, autorização também no serviço

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

Há duas formas de impedir que alguém leia dados de outra pessoa: filtrar nas consultas da
aplicação, ou impedir na base de dados. A primeira depende de ninguém se esquecer, uma única vez,
em nenhuma das centenas de consultas que um produto acumula.

## Decisão

**A RLS é a defesa principal.** Toda a tabela de utilizador nasce com RLS activa e **forçada** — o
`FORCE` faz com que as políticas se apliquem também ao dono da ligação, sem o qual qualquer ligação
privilegiada as ignora em silêncio.

Os privilégios são concedidos um a um. As políticas dizem _que linhas_; os `GRANT` dizem _que
operações_. Sem privilégio, a política nunca chega a ser avaliada; sem política, o privilégio é
demasiado largo. `perfis` não recebe `DELETE`, e `papeis_utilizador` só recebe `SELECT`: ninguém se
promove a si próprio, nem por engano nosso.

**A autorização na camada de serviço é a segunda linha, não a primeira.** `exigirPapel` corre no
servidor em cada operação privilegiada. Duas camadas porque falham de maneiras diferentes: um erro
de política é apanhado pelo serviço, um erro de serviço é apanhado pela política.

O middleware não é nenhuma das duas: é conveniência de navegação. Esconder um botão ou redireccionar
uma rota não protege dados.

## Consequências

- Um bug numa consulta deixa de ser uma fuga de dados
- Cinco testes auditam o esquema — RLS activa e forçada, nenhuma tabela sem política, zero
  privilégios para o visitante anónimo, matriz exacta de privilégios — e uma tabela futura sem RLS
  falha o build
- Custo: as políticas têm de ser lidas e escritas em SQL, e o acesso a dados passa obrigatoriamente
  pelo contexto de utilizador (ver ADR 0014)
