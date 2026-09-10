# lib/payments/

Adaptador de pagamentos.

**Fase 4, fora do âmbito do v1.** O v1 não tem monetização — decisão registada na especificação.
Nenhum SDK instalado, nenhuma conta ligada.

Quando existir:

- os direitos de acesso são verificados no servidor, a partir do nosso registo, nunca a partir do cliente
- os webhooks validam a assinatura e são idempotentes: o mesmo evento entregue duas vezes não cobra duas vezes
