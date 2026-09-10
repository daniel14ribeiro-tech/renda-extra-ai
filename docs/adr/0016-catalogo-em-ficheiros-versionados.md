# 0016 — Catálogo em ficheiros versionados

**Estado:** aceite · **Data:** 2026-09-10

## Contexto

O catálogo curado é o principal activo defensável do produto. Se for editado directamente na base de
dados, as alterações não têm revisão, não têm histórico legível e não têm autor.

## Decisão

As entradas de catálogo vivem em `content/catalogo/*.json`, validadas por esquema Zod. A base de
dados é o **destino**, não a fonte de verdade: uma alteração ao catálogo é um diff, com revisão e
autor, como qualquer outra alteração ao repositório.

A checklist de publicação do processo de curadoria está implementada em `motivosParaNaoPublicar`.
Uma entrada só passa a publicada quando não houver motivo que o impeça — a regra deixa de depender
de alguém se lembrar dela.

**Nada que exija verificação externa é preenchido por estimativa.** Faixas de rendimento ficam nulas
até haver fonte datada; requisitos legais são temas a confirmar e nunca afirmações; estimativas de
esforço são registadas como pendências. Um número inventado é indistinguível de um número apurado
depois de estar na base de dados.

## Consequências

- A curadoria é revisível, atribuível e reversível
- As três primeiras entradas ficam em rascunho, porque a checklist as recusa. É o processo a
  funcionar: publicá-las exigiria afirmar o que ainda não sabemos
- Custo: publicar exige trabalho de verificação a sério, e o catálogo cresce mais devagar
- O carregamento para uma base de dados real fica para quando houver base de dados real a alimentar;
  por agora o conteúdo é validado contra o esquema verdadeiro nos testes
