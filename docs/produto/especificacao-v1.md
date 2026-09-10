# Renda Extra AI — Especificação Funcional v1

> **Estado deste documento:** APROVADO como base do produto — revisão 3.
> Revisão 2 aprovada; nesta revisão foram fechadas seis decisões pendentes (ver §11).
> Documentos complementares, ambos vinculativos:
> [`definicoes-validacao.md`](./definicoes-validacao.md) e [`processo-curadoria.md`](./processo-curadoria.md).
> Tudo o que não seja verificável a partir do código está marcado como **[PRESSUPOSTO]** e precisa
> de confirmação antes de entrar em implementação.

---

## 1. Premissa do produto

Uma pessoa tem capacidades (competências, tempo, recursos, equipamento) que estão subutilizadas.
O que a impede de gerar rendimento extra não é falta de ideias — é **falta de um caminho concreto,
sequenciado e realista** entre o que sabe fazer e a confirmação de que alguém paga por isso.

O Renda Extra AI é um **sistema de execução**: transforma um perfil de capacidades numa oportunidade
escolhida a partir de um catálogo curado, e num plano de tarefas acompanhado até haver **validação
real de mercado**.

**Não é** um gerador de listas de ideias. A diferença entre este produto e um chat genérico é o
catálogo curado, o compromisso, o sequenciamento e o acompanhamento.

### 1.1 Métrica-norte: Tempo até à Primeira Validação (TTV)

A métrica-norte é o **tempo até à primeira validação real de mercado** — não o tempo até ao primeiro
euro isolado. O primeiro euro continua a ser o marco decisivo, mas é o topo de uma escada: medir só
o topo torna o produto cego durante as primeiras semanas, exactamente quando a desistência acontece.

**Escada de validação:**

| Nível  | Evento                                                                   | O que prova                               | Conta para                        |
| ------ | ------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------- |
| **N0** | Preparação concluída (oferta pronta, materiais feitos)                   | Nada sobre o mercado                      | Progresso interno apenas          |
| **N1** | **Exposição real** — oferta publicada ou apresentada a mercado real      | Que saiu do plano para o mundo            | **TTV** (início da métrica-norte) |
| **N2** | **Sinal de interesse** — resposta, pedido de orçamento, lead qualificado | Que a oferta é legível e desejável        | TTV                               |
| **N3** | **Primeira venda**                                                       | **Validação comercial — marco principal** | **TTV-venda**                     |
| **N4** | Repetição — segunda venda ou cliente recorrente                          | Que N3 não foi sorte                      | Retenção                          |

- **TTV** = dias entre a criação do plano e o primeiro evento de nível ≥ N1. É a métrica-norte.
- **TTV-venda** = dias até N3. É o **marco principal de validação comercial** e a métrica de sucesso
  do produto.

**Regra de produto:** N0 nunca é apresentado ao utilizador como validação. Preparar não é validar —
é o mecanismo de auto-engano mais comum em rendimento extra, e o produto não o alimenta.

**Regra de integridade:** todo o evento de nível ≥ N1 exige **evidência verificável** — data, canal e,
conforme o nível, ligação, contacto ou valor. Não se registam sensações de progresso.

Métricas de suporte: % que completa o núcleo do diagnóstico, % que atinge N1 na semana 2, % que
atinge N3 na semana 6, retenção às 8 semanas, distribuição de TTV por perfil de tempo disponível.

---

## 2. Personas e amplitude do produto

**Persona primária: P1** — é a que orienta decisões de desenho em caso de conflito. **Não é a que
define os limites do produto:** o diagnóstico cobre todo o espectro de perfis descrito em §3.1, e o
catálogo é curado para servir esse espectro.

| #                 | Persona                            | Contexto                                       | Constrangimento dominante                 | Objetivo típico                           |
| ----------------- | ---------------------------------- | ---------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| **P1** (primária) | **Assalariado com tempo limitado** | 30–45 anos, emprego a tempo inteiro            | 5–10h/semana, energia baixa ao fim do dia | +200–500 €/mês sem pôr o emprego em risco |
| P2                | **Freelancer subutilizado**        | Já vende serviços, receita irregular           | Não sabe diversificar nem subir preço     | Estabilizar e aumentar receita existente  |
| P3                | **Jovem / estudante**              | Muito tempo, pouco capital, poucas credenciais | Sem portefólio nem investimento inicial   | Primeiro rendimento próprio               |
| P4                | **Disponibilidade elevada**        | Desempregado, reformado, entre projectos       | Tempo abundante, urgência financeira      | Rendimento significativo e rápido         |
| P5                | **Já vende, quer escalar com IA**  | Experiência comercial consolidada              | Capacidade individual esgotada            | Alavancar competência existente           |

**Regra de produto:** nenhum perfil é rejeitado por sair do intervalo de P1. Um utilizador com 40h
semanais disponíveis, orçamento de 2.000 € e experiência comercial recebe correspondências
diferentes — não uma versão diluída do plano de P1.

---

## 3. Fluxo central — o "loop de execução"

```
Diagnóstico (multi-dimensional)
        ↓
Correspondência: catálogo curado → filtro de elegibilidade → personalização e ranking por IA
        ↓
Escolha (uma oportunidade)
        ↓
Plano ancorado na escada de validação: Preparação (N0) → Exposição (N1) → Conversão (N2→N3)
        ↓
Execução + registo de eventos de validação com evidência
        ↓
Revisão semanal → continuar | ajustar | pivotar
        ↑                                     │
        └─────────────────────────────────────┘
```

### 3.1 Diagnóstico multi-dimensional

Nove dimensões, todas com peso na correspondência:

| #   | Dimensão                     | Recolhe                                                                                           |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | **Tempo**                    | Horas/semana, distribuição (úteis vs. fim de semana), previsibilidade                             |
| 2   | **Experiência profissional** | Sector, anos, senioridade, natureza do trabalho                                                   |
| 3   | **Competências**             | Técnicas, criativas, manuais, relacionais — com nível auto-declarado                              |
| 4   | **Orçamento**                | Capital disponível para investir, incluindo 0 €                                                   |
| 5   | **Preferências**             | Online vs. presencial, com pessoas vs. sozinho, exposição pública, tipo de trabalho               |
| 6   | **Experiência comercial**    | Já vendeu? Sabe fixar preço, negociar, fazer follow-up? Resistência a vender?                     |
| 7   | **Experiência com IA**       | Nenhuma / ocasional / profissional — e em que contexto                                            |
| 8   | **Objetivos**                | Valor mensal, horizonte, motivação (complementar vs. substituir rendimento)                       |
| 9   | **Limitações**               | Exclusividade laboral, situação fiscal, saúde, mobilidade, obrigações familiares, aversão a risco |

**Dimensões 6 e 7 são determinantes e frequentemente ignoradas.** A experiência comercial prevê o
esforço da fase de Exposição melhor do que qualquer competência técnica — quem nunca vendeu trava em
N1, não em N0. A experiência com IA determina que oportunidades assistidas por IA são realistas e
quanto acompanhamento o plano tem de incluir.

**Estrutura adaptativa** — a amplitude não pode custar abandono no onboarding:

- **Núcleo obrigatório (~4 min)** — tempo, competências, orçamento, objetivos, limitações
  bloqueantes. Suficiente para produzir correspondências.
- **Aprofundamento condicional** — dimensões 2, 5, 6, 7 e limitações detalhadas, com ramificação
  conforme as respostas. Retomável, guardado a cada passo.
- **Grau de completude** visível: o utilizador vê que correspondências com diagnóstico incompleto
  são menos fiáveis, e o que ganha ao completar. O aprofundamento é procurado, não imposto.

**[PRESSUPOSTO]** Nenhuma correspondência é gerada abaixo do núcleo obrigatório completo.

### 3.2 Correspondência: catálogo curado + IA

**Modelo híbrido.** O produto não depende de oportunidades inventadas pelo modelo.

**Passo 1 — Catálogo curado.** Base de oportunidades escritas e revistas por nós: descrição canónica,
requisitos de competência/tempo/capital, faixas de rendimento observadas, requisitos legais e fiscais
em Portugal, e um **playbook base** (fases e tarefas modelo, ancoradas na escada de validação).

**Passo 2 — Filtro de elegibilidade.** Determinístico, sem IA: exclui o que colide com limitações
bloqueantes, orçamento ou tempo mínimo. Regras auditáveis e testáveis.

**Passo 3 — Personalização e ranking por IA.** Sobre os elegíveis, a IA:

- adapta a descrição ao perfil concreto (competências, sector, experiência comercial);
- calcula os cinco eixos para **este** utilizador, não em abstracto;
- ordena por adequação e justifica cada posição em linguagem clara;
- ajusta o playbook base ao contexto (menos passos para quem já vende, mais andaimes para quem nunca vendeu).

**Cinco eixos, sempre visíveis:**

| Eixo                    | Significado                                          |
| ----------------------- | ---------------------------------------------------- |
| **Fit**                 | Alinhamento com o perfil das nove dimensões          |
| **Tempo até validação** | Dias estimados até N1 e até N3                       |
| **Potencial mensal**    | Faixa realista observada, nunca o melhor caso        |
| **Esforço semanal**     | Horas necessárias, confrontadas com as disponíveis   |
| **Risco / requisitos**  | Investimento, obrigações legais e fiscais, exposição |

São apresentadas **5 a 7 oportunidades**. Nenhuma é mostrada sem os cinco eixos preenchidos.

**Cobertura insuficiente.** Quando nenhuma entrada do catálogo atinge o limiar mínimo de adequação, a
IA pode propor **candidatos** — no máximo 2, visivelmente marcados como **não curados**, sempre
ordenados abaixo de qualquer entrada curada, e sem os mesmos dados verificados. Cada candidato entra
automaticamente na **fila de curadoria**. É assim que o catálogo cresce a partir de lacunas reais em
vez de suposições.

**Regra de produto:** a IA nunca escreve no catálogo. Curadoria é acto humano.

### 3.3 Escolha — anti-dispersão

O utilizador escolhe **uma** oportunidade. No máximo duas, e a segunda só após a primeira atingir N3.
Restrição deliberada: a dispersão é a causa mais comum de falha em rendimento extra.

### 3.4 Plano de execução ancorado na validação

O playbook base da oportunidade é adaptado ao perfil e organizado em **três fases que correspondem à
escada de validação** — não em fases arbitrárias:

| Fase              | Objetivo                              | Fecha em    |
| ----------------- | ------------------------------------- | ----------- |
| **1. Preparação** | Oferta, preço, materiais mínimos      | N0          |
| **2. Exposição**  | Pôr a oferta à frente de mercado real | **N1**      |
| **3. Conversão**  | Responder, negociar, fechar           | N2 → **N3** |

Cada tarefa tem acção verificável, critério de conclusão explícito, esforço em minutos e dependências.

**Regra de produto:** a Fase 1 tem **duração máxima**. Ultrapassado o limite, o produto força a
passagem a Exposição com o que existir. Preparação infinita é a principal forma de fracasso silencioso.

O limite é **14 dias** — assumido como **hipótese de produto configurável, não como facto validado**.
É parametrizável por oportunidade e alterável globalmente sem alteração de código, para poder ser
corrigido com os dados de TTV reais assim que existirem.

Detalhe progressivo: os primeiros 7 dias ao nível da tarefa; fases seguintes em esboço, detalhadas ao
fechar a anterior.

### 3.5 Execução e acompanhamento

- Checklist de tarefas, progresso por fase, próxima acção sempre visível
- **Registo de eventos de validação** (N1–N4) com evidência obrigatória
- Registo de rendimento real, com data e origem, ligado ao evento N3 ou N4
- Lembrete semanal **[PRESSUPOSTO: email via Resend no v1]**

### 3.6 Revisão semanal

A IA compara plano com executado **e com a escada de validação**: em que nível está, há quantos dias,
o que trava a subida. Três desfechos: **continuar**, **ajustar**, **pivotar** — o último com registo
do motivo, que alimenta a curadoria do catálogo.

---

## 4. Ecrãs do v1 (mobile-first)

| #   | Ecrã                    | Função                                                                           |
| --- | ----------------------- | -------------------------------------------------------------------------------- |
| 1   | Autenticação            | Registo e entrada (email + OTP, OAuth Google)                                    |
| 2   | Diagnóstico             | Núcleo + aprofundamento condicional, progresso persistido, completude visível    |
| 3   | Oportunidades           | Lista ordenada, comparável, com origem (curada / candidato) visível              |
| 4   | Detalhe da oportunidade | Cinco eixos, requisitos legais e fiscais, justificação do ranking                |
| 5   | Dashboard               | Nível de validação atual, dias em curso, próxima tarefa, rendimento vs. objetivo |
| 6   | Plano                   | Três fases ancoradas na escada, progresso                                        |
| 7   | Detalhe da tarefa       | Instruções, critério de conclusão, marcar como feita                             |
| 8   | Registo de validação    | Lançar evento N1–N4 com evidência; valor quando aplicável                        |
| 9   | Revisão semanal         | Diagnóstico da IA e decisão continuar/ajustar/pivotar                            |
| 10  | Perfil e definições     | Dados, exportar, eliminar conta (RGPD)                                           |

---

## 5. Modelo de dados (proposta inicial)

Postgres via Supabase. **RLS ativa em todas as tabelas de utilizador** — sem exceção — com isolamento
por `user_id`.

**Catálogo (global, sem `user_id`, leitura pública autenticada, escrita restrita a curadores):**

- `opportunity_catalog` — entrada curada: descrição canónica, requisitos, faixas observadas,
  requisitos legais/fiscais, estado (rascunho/publicado/arquivado), curador, data da última revisão
- `catalog_playbooks` — playbook base por entrada: fases e tarefas modelo ancoradas em N0/N1/N3
- `catalog_eligibility_rules` — regras determinísticas do filtro do passo 2
- `curation_queue` — candidatos propostos pela IA e pivots registados, para revisão humana

**Utilizador:**

- `profiles` — dados do utilizador, ligados a `auth.users`
- `diagnostics` — respostas por dimensão, snapshot imutável e versionado, com grau de completude
- `opportunity_matches` — correspondência diagnóstico × entrada do catálogo: cinco eixos
  personalizados, posição, justificação, origem (curada/candidato)
- `plans` — plano ativo (**invariante: no máximo 1 ativo por utilizador**)
- `plan_phases` — as três fases, com estado e limite temporal da Preparação
- `tasks` — tarefas com critério de conclusão, esforço, dependências, estado
- `validation_events` — **tabela central da métrica-norte**: nível (N1–N4), data, canal, evidência
- `income_entries` — rendimento real, ligado ao evento de validação correspondente
- `weekly_reviews` — revisões e decisão tomada

**Operação:**

- `ai_generations` — auditoria de cada chamada: prompt versionado, tokens, custo, latência, resultado
- `usage_quotas` — quotas de geração por utilizador e período

`validation_events` é a tabela mais importante do sistema: sem ela não existe métrica-norte.
`ai_generations` e `usage_quotas` não são opcionais — sem elas não há controlo de custo nem
depuração do modelo em produção.

---

## 6. Fronteiras do v1

| Fora do âmbito                          | Motivo                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| Pagamentos e subscrições                | Decisão tomada: validar o núcleo primeiro                                           |
| Marketplace ou ligação a clientes reais | Muda o produto de ferramenta para intermediário — outro negócio, outro risco legal  |
| Verificação automática de evidência     | Evidência é declarada com prova anexada, não verificada por integração              |
| Comunidade / social                     | Não encurta o TTV                                                                   |
| App nativa                              | PWA cobre o v1                                                                      |
| Integração bancária                     | Risco regulatório desproporcionado                                                  |
| Aconselhamento fiscal automatizado      | Responsabilidade legal — o produto informa que existem obrigações, nunca as calcula |

---

## 7. Regras transversais

1. **Disclaimer permanente** — não presta aconselhamento financeiro, fiscal ou jurídico.
2. **Preparar não é validar** — N0 nunca é apresentado como progresso de mercado.
3. **Evidência obrigatória** — nenhum evento ≥ N1 sem prova declarada.
4. **Realismo sobre otimismo** — faixas realistas observadas, nunca o melhor caso.
5. **Origem sempre visível** — o utilizador distingue oportunidade curada de candidato da IA.
6. **A IA nunca tem privilégios diretos** — não escreve na base de dados nem no catálogo; produz saída
   estruturada, validada antes de persistida.
7. **Nenhum perfil é diluído** — a amplitude do diagnóstico serve para diferenciar planos, não para os aproximar.
8. **Quotas visíveis** — custo de IA controlado desde o primeiro dia.
9. **RGPD desde o início** — exportação e eliminação de conta no v1.

---

## 8. Decisões tomadas

| Decisão                      | Escolha                                                                                                 | Data       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| Camada de dados e auth       | **Supabase** (Postgres + Auth + RLS + Storage)                                                          | 2026-09-10 |
| Monetização no v1            | **Sem pagamentos**; Stripe adiado para pós-validação                                                    | 2026-09-10 |
| Ordem de trabalho            | **Especificação funcional antes de implementação**                                                      | 2026-09-10 |
| Métrica-norte                | **TTV** — tempo até à primeira validação real; primeira venda (N3) como marco comercial principal       | 2026-09-10 |
| Amplitude do diagnóstico     | **Nove dimensões**; P1 primária mas não limitativa                                                      | 2026-09-10 |
| Origem das oportunidades     | **Híbrido** — catálogo curado + personalização e ranking por IA                                         | 2026-09-10 |
| Mercado e idioma do v1       | **Portugal exclusivamente, pt-PT**; sem i18n nesta fase                                                 | 2026-09-10 |
| Catálogo de lançamento       | **30 entradas curadas**, com matriz de cobertura mínima definida                                        | 2026-09-10 |
| Limite da fase de Preparação | **14 dias**, como hipótese configurável e não como facto                                                | 2026-09-10 |
| Definições de N1 e N2        | **Fechadas por tipo de oportunidade (T1–T6)**, observáveis e testáveis — ver `definicoes-validacao.md`  | 2026-09-10 |
| Manutenção do catálogo       | **Processo mínimo definido** (papéis, estados, cadência, checklist, fila) — ver `processo-curadoria.md` | 2026-09-10 |
| Sequenciamento da curadoria  | **Em paralelo com a engenharia**; 3 entradas na Fase 0, 30 no lançamento                                | 2026-09-10 |

Restante stack proposta (a confirmar na Fase 0): Next.js 15 App Router · TypeScript strict ·
Tailwind + shadcn/ui · Drizzle ORM com migrações versionadas · Zod em todos os limites ·
Anthropic API server-side · Vercel · Sentry.

---

## 9. Decisões em aberto

**Bloqueiam a Fase 3 (núcleo funcional):**

1. **Limiar de adequação que aciona candidatos não curados** — demasiado alto enche o produto de
   conteúdo não verificado; demasiado baixo apresenta correspondências fracas como se fossem boas.
   Só é calibrável com o catálogo real: fica para o fim da curadoria inicial.
2. **Quem ocupa o papel de curador** — o processo está definido em `processo-curadoria.md`, a pessoa
   está por nomear. Sem responsável atribuído, o catálogo degrada-se independentemente do processo.

**Não bloqueantes:**

3. **Profundidade do acompanhamento** — email chega ao v1, ou é preciso push/PWA?
4. **Modelo de acesso** — aberto, lista de espera, ou convite?
5. **Limiar de "exposição de baixo alcance" em N1** — depende de dados que ainda não existem.

**Nenhuma decisão em aberto bloqueia a Fase 0.**

## 10. Estado de execução

**Fase 0 — Fundação: em curso.** Scaffold, qualidade, CI e estrutura arquitectural, sem qualquer
funcionalidade de negócio.

A curadoria do catálogo decorre **em paralelo**, não em série: a engenharia não espera pelas 30
entradas, e a curadoria não espera pelo código. As metas por fase estão em `processo-curadoria.md` §8.

## 11. Histórico de revisões

**Revisão 3 — 2026-09-10.** Seis decisões fechadas: mercado pt-PT sem i18n; catálogo de lançamento
de 30 entradas; limite de Preparação de 14 dias como hipótese configurável; definições operacionais
de N1 e N2 por tipo de oportunidade (documento próprio); processo mínimo de curadoria (documento
próprio); curadoria em paralelo com a engenharia. Fase 0 autorizada.

**Revisão 2 — 2026-09-10.** Três correções de produto:

1. Métrica-norte passa de "tempo até ao primeiro euro" para **TTV — tempo até à primeira validação
   real**, com escada de validação N0–N4 e a primeira venda (N3) como marco comercial principal.
2. Diagnóstico alargado de 6 para **9 dimensões** com estrutura adaptativa; P1 continua primária mas
   deixa de limitar o âmbito; personas P4 e P5 acrescentadas.
3. Oportunidades passam de geração integral por IA para **modelo híbrido**: catálogo curado + filtro
   determinístico + personalização e ranking por IA, com fila de curadoria para lacunas.

**Revisão 1 — 2026-09-10.** Versão inicial.
