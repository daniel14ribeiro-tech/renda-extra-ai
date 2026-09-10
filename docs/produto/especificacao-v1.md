# Renda Extra AI — Especificação Funcional v1

> **Estado deste documento:** PROPOSTA para validação.
> Foi redigido a partir da única descrição existente no repositório (a linha do `README.md`).
> Tudo o que não seja verificável a partir do código está marcado como **[PRESSUPOSTO]** e precisa
> de confirmação antes de entrar em implementação.

---

## 1. Premissa do produto

Uma pessoa tem capacidades (competências, tempo, recursos, equipamento) que estão subutilizadas.
O que a impede de gerar rendimento extra não é falta de ideias — é **falta de um caminho concreto,
sequenciado e realista** entre o que sabe fazer e o primeiro euro ganho.

O Renda Extra AI é um **sistema de execução**: transforma um inventário de capacidades numa
oportunidade escolhida e num plano de tarefas acompanhado até haver rendimento real registado.

**Não é** um gerador de listas de ideias. A diferença entre este produto e um chat genérico é o
compromisso, o sequenciamento e o acompanhamento.

### Métrica-norte

**Tempo até ao primeiro euro registado** (TTFE). Todas as decisões de produto se subordinam a
encurtar este intervalo. Métricas de suporte: % que completa o diagnóstico, % que completa a
primeira tarefa, % que regista rendimento na semana 4, retenção às 8 semanas.

---

## 2. Personas **[PRESSUPOSTO]**

| # | Persona | Contexto | Constrangimento dominante | Objetivo típico |
|---|---|---|---|---|
| P1 | **Assalariado com tempo limitado** | 30–45 anos, emprego a tempo inteiro | 5–10h livres por semana, energia baixa ao fim do dia | +200–500 €/mês sem pôr o emprego em risco |
| P2 | **Freelancer subutilizado** | Já vende serviços, receita irregular | Não sabe diversificar nem subir preço | Estabilizar e aumentar receita existente |
| P3 | **Jovem / estudante** | Muito tempo, pouco capital, poucas credenciais | Sem portefólio nem investimento inicial | Primeiro rendimento próprio, qualquer valor |

**Persona primária do v1: P1.** É a que tem constrangimento mais claro (tempo), maior disposição a
pagar no futuro, e a que mais beneficia de sequenciamento. P2 e P3 são servidas por acaso, não por
desenho, até ao v2.

---

## 3. Fluxo central — o "loop de execução"

```
Diagnóstico → Oportunidades → Escolha → Plano → Execução → Revisão → (ajusta ou pivota)
     ↑                                                                        │
     └────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Diagnóstico de capacidades

Questionário multi-passo, mobile-first, com progresso guardado a cada passo. Recolhe:

- **Competências** — o que sabe fazer, com nível auto-declarado
- **Tempo disponível** — horas/semana e distribuição (dias úteis vs. fim de semana)
- **Capital inicial** — faixa de investimento possível (inclui 0 €)
- **Recursos** — equipamento, carro, espaço, audiência existente
- **Objetivo** — valor mensal pretendido e horizonte temporal
- **Restrições** — exclusividade com o empregador, situação fiscal, aversão a exposição pública

**Regra de produto:** o diagnóstico tem de ser concluível em **menos de 6 minutos** no telemóvel.
Se exceder, corta-se profundidade, não se parte em duas sessões.

### 3.2 Geração de oportunidades

A IA produz **5 a 7 oportunidades**, cada uma pontuada em cinco eixos visíveis ao utilizador:

| Eixo | Significado |
|---|---|
| **Fit** | Alinhamento com as capacidades declaradas |
| **Tempo até 1º euro** | Dias estimados até à primeira receita |
| **Potencial mensal** | Faixa realista de rendimento, não o melhor caso |
| **Esforço semanal** | Horas necessárias, confrontadas com as disponíveis |
| **Risco / requisitos** | Investimento, obrigações legais e fiscais, exposição |

**Regra de produto:** nenhuma oportunidade é apresentada sem os cinco eixos preenchidos. Uma
oportunidade sem estimativa de esforço é uma ideia, não uma oportunidade.

### 3.3 Escolha — anti-dispersão

O utilizador escolhe **uma** oportunidade. No máximo duas, e a segunda só depois de a primeira ter
rendimento registado. Esta restrição é deliberada e é o principal mecanismo de produto: a dispersão
é a causa mais comum de falha em rendimento extra.

### 3.4 Plano de execução

A oportunidade escolhida é decomposta em **fases** e **tarefas**, cada tarefa com:

- Ação concreta e verificável (não "fazer marketing", mas "publicar 3 anúncios no OLX com estas fotos")
- Critério de conclusão explícito
- Esforço estimado em minutos
- Dependências

Os **primeiros 7 dias** são detalhados ao nível da tarefa individual. As fases seguintes ficam em
esboço e só são detalhadas quando a fase anterior fecha — evita planos de 60 tarefas que ninguém lê.

### 3.5 Execução e acompanhamento

- Checklist de tarefas com estado e progresso por fase
- **Registo de rendimento real** — o utilizador lança valores recebidos, com data e origem
- Notificação/lembrete semanal **[PRESSUPOSTO: canal a definir — email via Resend no v1]**

### 3.6 Revisão semanal

Uma vez por semana a IA compara o plano com o executado e produz um diagnóstico curto: o que
avançou, o que travou, o ajuste recomendado. Três desfechos possíveis: **continuar**, **ajustar o
plano**, ou **pivotar** para outra oportunidade — este último com registo do motivo.

---

## 4. Ecrãs do v1 (mobile-first)

| # | Ecrã | Função |
|---|---|---|
| 1 | Autenticação | Registo e entrada (email + OTP, OAuth Google) |
| 2 | Diagnóstico | Fluxo multi-passo com progresso persistido |
| 3 | Oportunidades | Lista pontuada, comparável, ordenável |
| 4 | Detalhe da oportunidade | Os cinco eixos em detalhe, requisitos, o que envolve na prática |
| 5 | Dashboard | Plano ativo, próxima tarefa, rendimento acumulado vs. objetivo |
| 6 | Plano | Fases e tarefas, estado de progresso |
| 7 | Detalhe da tarefa | Instruções, critério de conclusão, marcar como feita |
| 8 | Registo de rendimento | Lançar valor, data, origem |
| 9 | Revisão semanal | Diagnóstico da IA e decisão continuar/ajustar/pivotar |
| 10 | Perfil e definições | Dados, exportar, eliminar conta (RGPD) |

---

## 5. Modelo de dados (proposta inicial)

Postgres via Supabase. **RLS ativa em todas as tabelas** — sem exceção — com isolamento por
`user_id`. Tabelas centrais:

- `profiles` — dados do utilizador, ligados a `auth.users`
- `diagnostics` — respostas do diagnóstico (snapshot imutável por versão)
- `opportunities` — oportunidades geradas, com os cinco eixos de pontuação
- `plans` — plano ativo por oportunidade escolhida (**invariante: no máximo 1 plano ativo por utilizador**)
- `plan_phases` — fases do plano, ordenadas, com estado
- `tasks` — tarefas, com critério de conclusão, esforço, dependências, estado
- `income_entries` — rendimento real registado
- `weekly_reviews` — revisões semanais e a decisão tomada
- `ai_generations` — auditoria de cada chamada à IA: prompt versionado, tokens, custo, latência, resultado
- `usage_quotas` — quotas de geração por utilizador e período

`ai_generations` e `usage_quotas` não são opcionais: sem elas não há como controlar custo nem
depurar comportamento do modelo em produção.

---

## 6. Fronteiras do v1 (o que fica de fora, e porquê)

| Fora do âmbito | Motivo |
|---|---|
| Pagamentos e subscrições | Decisão tomada: validar o núcleo primeiro |
| Marketplace ou ligação a clientes reais | Muda o produto de ferramenta para intermediário — outro negócio, outro risco legal |
| Comunidade / social | Não encurta o tempo até ao primeiro euro |
| App nativa | PWA cobre o v1; nativo só com retenção provada |
| Integração bancária | Risco regulatório desproporcionado; registo manual chega |
| Aconselhamento fiscal automatizado | Responsabilidade legal — o produto informa que existem obrigações, nunca as calcula |

---

## 7. Regras transversais

1. **Disclaimer permanente** — o produto não presta aconselhamento financeiro, fiscal ou jurídico.
   Visível no onboarding e no detalhe de cada oportunidade.
2. **Realismo sobre otimismo** — as estimativas de rendimento apresentam faixa realista, nunca o
   melhor caso. Prometer de mais destrói a retenção na semana 3.
3. **A IA nunca tem privilégios diretos** — não escreve na base de dados, não executa ações; produz
   saída estruturada que é validada e só depois persistida.
4. **Quotas visíveis** — o utilizador sabe quantas gerações lhe restam. Custo de IA controlado desde
   o primeiro dia.
5. **RGPD desde o início** — exportação e eliminação de conta fazem parte do v1, não do lançamento.

---

## 8. Decisões técnicas já tomadas

| Decisão | Escolha | Data |
|---|---|---|
| Camada de dados e auth | **Supabase** (Postgres + Auth + RLS + Storage) | 2026-09-10 |
| Monetização no v1 | **Sem pagamentos**; Stripe adiado para pós-validação | 2026-09-10 |
| Ordem de trabalho | **Especificação funcional antes de implementação** | 2026-09-10 |

Restante stack proposta (a confirmar na Fase 0): Next.js 15 App Router · TypeScript strict ·
Tailwind + shadcn/ui · Drizzle ORM com migrações versionadas · Zod em todos os limites ·
Anthropic API server-side · Vercel · Sentry.

---

## 9. Questões em aberto — a resolver antes da Fase 3

1. **Mercado e idioma** — Portugal e português europeu apenas, ou multi-mercado desde o início? Afeta
   catálogo de oportunidades, referências legais e fiscais, e i18n na fundação.
2. **Origem das oportunidades** — inteiramente geradas pela IA, ou curadoria própria de um catálogo
   base que a IA personaliza? A segunda opção dá muito mais qualidade e controlo, mas exige trabalho
   de conteúdo.
3. **Profundidade do acompanhamento** — lembretes por email chegam ao v1, ou o acompanhamento precisa
   de push/PWA para funcionar?
4. **Validação do rendimento** — registo manual é suficiente para credibilizar a métrica-norte?
5. **Modelo de acesso** — aberto, lista de espera, ou convite? Afeta o desenho do onboarding.

---

## 10. Próximo passo

Validação deste documento. Após aprovação (com as correções que fizeres), a **Fase 0 — Fundação**
arranca: scaffold, qualidade, CI, sem qualquer funcionalidade de negócio.
