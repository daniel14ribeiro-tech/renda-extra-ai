# Definições Operacionais de Validação (N0–N4)

> **Estado:** fechado para a Fase 3. Alterações exigem nova revisão da especificação.
> Este documento torna a métrica-norte (TTV) implementável e testável. Sem ele, "validação real"
> é uma expressão vaga e a métrica não é auditável.

---

## 1. Princípios

Um evento de validação só é registável se cumprir os quatro princípios seguintes:

1. **Observável por terceiros** — corresponde a um artefacto que existe fora da cabeça do utilizador:
   um anúncio publicado, uma mensagem recebida, um pagamento liquidado.
2. **Datável** — tem data e hora atribuíveis.
3. **Com evidência declarada** — o utilizador anexa prova do tipo exigido para aquele nível e tipo de
   oportunidade. A evidência é declarada pelo utilizador, não verificada por integração (fora do âmbito do v1).
4. **Com contraparte não relacionada** — a partir de N2, a contraparte não pode ser familiar directo
   nem amigo próximo. Uma encomenda de um primo não valida mercado.

**Nunca contam como validação:** intenção, preparação, aprendizagem, pesquisa de mercado, criação de
materiais, "sentir que está quase", ou conversas sem pedido concreto.

---

## 2. Tipos de oportunidade

Toda a entrada do catálogo tem exactamente um tipo. O tipo determina as regras de validação aplicáveis.

| Código | Tipo | Exemplos |
|---|---|---|
| **T1** | Serviço local presencial | Explicações, reparações, limpezas, apoio a eventos, jardinagem |
| **T2** | Serviço profissional remoto | Design, copywriting, desenvolvimento, consultoria, tradução |
| **T3** | Produto digital | Ebook, template, curso, preset, ferramenta |
| **T4** | Produto físico | Artesanato, restauro, revenda, produção artesanal |
| **T5** | Conteúdo com audiência | Afiliação, patrocínio, conteúdo por encomenda |
| **T6** | Trabalho em plataforma | Marketplaces e plataformas de trabalho por tarefa ou projecto |

---

## 3. N1 — Exposição real

**Definição geral:** a oferta tornou-se alcançável, sem intermediação do utilizador, por pelo menos
uma pessoa que não o próprio.

| Tipo | Evento observável | Evidência exigida | Não conta |
|---|---|---|---|
| **T1** | Anúncio publicado em canal com alcance real, ou oferta apresentada presencialmente a ≥3 potenciais clientes identificáveis | Ligação pública ou captura com data; ou lista datada dos contactos abordados | Cartazes por afixar; anúncio em rascunho |
| **T2** | Perfil ou proposta enviada a ≥3 clientes potenciais reais, ou oferta publicada em canal profissional | Cópia das mensagens enviadas com data; ou ligação ao perfil publicado | Perfil criado sem candidaturas nem publicação |
| **T3** | Produto listado e comprável, com preço e meio de pagamento activo | Ligação pública à página de compra | Página de espera; produto ainda em produção |
| **T4** | Produto listado à venda com preço e stock, ou apresentado em ponto de venda real | Ligação ao anúncio ou fotografia datada do ponto de venda | Produto feito mas não listado |
| **T5** | Conteúdo publicado com oferta explícita (ligação de afiliação, contacto comercial, kit de patrocínio enviado) | Ligação à publicação, ou envio do kit com data | Conteúdo sem oferta associada |
| **T6** | Candidatura submetida a ≥3 tarefas/projectos, ou perfil activo e disponível para receber trabalho | Referência ou captura das candidaturas na plataforma | Registo na plataforma sem candidatura nem disponibilidade activa |

**Regra transversal de N1:** publicar num canal sem qualquer audiência (ex.: página sem tráfego,
grupo inexistente) conta como N1 técnico mas fica assinalado como **exposição de baixo alcance** na
revisão semanal. O produto não bloqueia, mas nomeia o problema.

---

## 4. N2 — Sinal de interesse

**Definição geral:** um terceiro não relacionado praticou um acto voluntário que sinaliza intenção de
comprar. O acto parte do mercado, não do utilizador.

| Tipo | Evento observável | Evidência exigida |
|---|---|---|
| **T1** | Pedido de orçamento, pergunta sobre disponibilidade ou marcação de visita | Mensagem, chamada registada ou marcação, com data |
| **T2** | Resposta a proposta com pedido de detalhe, convite a reunião, ou pedido de orçamento | Mensagem ou convite de reunião com data |
| **T3** | Pedido de informação pré-compra, entrada em lista com intenção declarada, ou carrinho abandonado identificável | Mensagem ou registo da plataforma |
| **T4** | Pedido de reserva, pergunta sobre disponibilidade, envio ou personalização | Mensagem ou registo do anúncio |
| **T5** | Contacto de marca, pedido de parceria, ou clique com conversão parcial rastreável | Mensagem ou relatório do painel de afiliação |
| **T6** | Convite, entrevista, pedido de orçamento ou proposta aceite mas ainda não paga | Registo da plataforma com data |

**Não conta como N2:** gostos, seguidores, visualizações, comentários de apoio, "avisa-me quando
tiveres", ou interesse manifestado por familiares e amigos próximos.

---

## 5. N3 — Primeira venda (marco comercial principal)

**Definição:** valor recebido, ou confirmado como devido por trabalho concluído e aceite, de uma
contraparte não relacionada.

| Situação | Conta? |
|---|---|
| Pagamento recebido (transferência, MB Way, plataforma, numerário com registo) | **Sim** |
| Trabalho entregue e aceite, com pagamento a 30 dias acordado por escrito | **Sim**, com data do acordo |
| Adiantamento ou sinal de cliente real | **Sim** |
| Troca sem dinheiro, permuta ou trabalho gratuito para portefólio | Não |
| Venda a familiar directo ou amigo próximo | Não |
| Reembolso posterior integral | Anula o evento; o utilizador regista a anulação |

**Evidência exigida:** comprovativo de pagamento, extracto da plataforma, ou recibo emitido.

---

## 6. N4 — Repetição

Segunda venda a cliente distinto, **ou** segunda compra do mesmo cliente. Prova que N3 não foi
acaso. Mesma evidência de N3.

---

## 7. Implementação — regras testáveis

Cada par (tipo, nível) define os campos obrigatórios do evento. A validação é determinística, ocorre
no servidor no momento do registo, e é coberta por testes unitários.

Campos comuns a qualquer evento: `nivel`, `tipo_oportunidade`, `data_evento`, `canal`,
`tipo_evidencia`, `contraparte_relacionada` (booleano declarado).

Tipos de evidência aceites: `url_publica`, `captura_ecra`, `mensagem_recebida`, `mensagem_enviada`,
`referencia_plataforma`, `comprovativo_pagamento`, `recibo_emitido`.

Invariantes verificáveis em teste:

1. Nenhum evento de nível ≥ N1 é aceite sem `tipo_evidencia` válido para o par (tipo, nível).
2. Eventos de nível ≥ N2 com `contraparte_relacionada = verdadeiro` são rejeitados.
3. Os níveis não podem ser saltados sem registo explícito: registar N3 sem N1 força o registo
   retroactivo da data de N1.
4. `data_evento` não pode ser futura, nem anterior à criação do plano.
5. N1 é irrepetível por plano; N2, N3 e N4 são repetíveis.
6. A anulação de um N3 recalcula o TTV-venda em vez de o apagar.

---

## 8. Decisões em aberto

- Limiar quantitativo de "baixo alcance" em N1 (§3) — depende de dados que ainda não existem.
- Verificação automática de evidência: fora do âmbito do v1, reavaliar após dados de fraude ou erro.
