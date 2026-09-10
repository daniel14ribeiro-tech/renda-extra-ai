# 0017 — Primitivos de UI escritos à mão

**Estado:** aceite · **Data:** 2026-09-10 · **Relacionado:** ADR 0007

## Contexto

O ADR 0007 escolheu shadcn/ui, cujos componentes são copiados para o repositório através de um
comando que os descarrega de um registo remoto. Nos ambientes de desenvolvimento em uso, esse
registo não é alcançável.

## Decisão

Os primitivos necessários à Fase 1 — botão, campo e etiqueta — são escritos à mão, sobre os tokens
do sistema de design e com a mesma forma que os do shadcn/ui: variantes com `class-variance-authority`,
composição por `cn`, propriedades nativas do elemento.

Isto não contraria o ADR 0007. O modelo do shadcn/ui é precisamente ter os componentes no
repositório, mantidos por nós; o comando é uma conveniência de arranque, não a decisão.

## Consequências

- A Fase 1 não fica bloqueada por uma dependência de rede
- `components.json` permanece configurado: quando o registo estiver acessível, o comando funciona e
  os componentes futuros podem vir por lá
- Custo: os primitivos existentes são nossos desde o início — o que aliás já era verdade
- Nenhum primitivo depende de Radix ainda. Quando um componente exigir comportamento acessível não
  trivial (diálogo, menu, selecção), Radix entra nessa altura e não antes
