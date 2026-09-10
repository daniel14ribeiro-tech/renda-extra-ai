# Processo de Curadoria do Catálogo

> **Estado:** processo mínimo aprovado para o v1. Desenhado para uma equipa de uma a duas pessoas.
> O catálogo é o principal activo defensável do produto. Sem processo de manutenção, degrada-se
> sozinho — plataformas mudam regras, mercados saturam, valores desactualizam-se.

---

## 1. Papéis

| Papel       | Responsabilidade                                                            | v1                                                                      |
| ----------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Curador** | Escreve e actualiza entradas; recolhe e data fontes; mantém o playbook base | **[A NOMEAR]** — uma pessoa                                             |
| **Revisor** | Verifica a checklist de publicação antes de publicar                        | Pode ser a mesma pessoa, mas a checklist é obrigatória e fica registada |
| **Triador** | Processa a fila de candidatas na cadência definida                          | Mesma pessoa no v1                                                      |

**Regra:** nenhuma entrada é publicada sem checklist preenchida e curador atribuído. Com uma só
pessoa, a checklist substitui a segunda opinião — não é dispensada por isso.

A IA nunca cura. Propõe candidatas, personaliza e ordena; não escreve no catálogo.

---

## 2. Estados da entrada

```
rascunho → em_revisao → publicado ⇄ em_atualizacao → arquivado
                              ↑
                    (candidata promovida)
```

| Estado           | Significado                                              | Visível ao utilizador                                                   |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| `rascunho`       | Em escrita, incompleta                                   | Não                                                                     |
| `em_revisao`     | Completa, à espera da checklist                          | Não                                                                     |
| `publicado`      | Verificada e dentro do prazo de revisão                  | Sim                                                                     |
| `em_atualizacao` | Prazo de revisão ultrapassado ou informação sob suspeita | Sim, marcada como **informação por confirmar**, despromovida no ranking |
| `arquivado`      | Deixou de ser viável ou não foi revista a tempo          | Não. Planos ativos existentes mantêm-se, com aviso                      |

**Regra de degradação automática:** entrada com `data_proxima_revisao` ultrapassada passa a
`em_atualizacao` sem intervenção. Passados mais 90 dias sem revisão, passa a `arquivado`. O
catálogo não permanece silenciosamente desactualizado.

---

## 3. Campos de manutenção obrigatórios

| Campo                  | Descrição                                                |
| ---------------------- | -------------------------------------------------------- |
| `curador`              | Quem é responsável por esta entrada                      |
| `estado`               | Conforme §2                                              |
| `versao`               | Incrementada em cada alteração material                  |
| `data_ultima_revisao`  | Data da última verificação completa                      |
| `data_proxima_revisao` | Calculada a partir da classe de volatilidade (§4)        |
| `classe_volatilidade`  | `alta` / `media` / `baixa`                               |
| `tipo_oportunidade`    | T1–T6 — determina as regras de validação aplicáveis      |
| `fontes[]`             | Cada fonte com URL ou referência, **e data de consulta** |
| `verificacoes`         | Checklist de publicação preenchida (§5)                  |
| `motivo_arquivo`       | Obrigatório ao arquivar                                  |

Uma faixa de rendimento sem fonte datada é uma opinião. Não passa a checklist.

---

## 4. Cadência de revisão

| Classe    | Aplica-se a                                                                                | Revisão      |
| --------- | ------------------------------------------------------------------------------------------ | ------------ |
| **Alta**  | Dependente de regras, comissões ou algoritmos de plataformas; mercados de saturação rápida | **90 dias**  |
| **Média** | Serviços remotos, produtos digitais, procura estável mas concorrência móvel                | **180 dias** |
| **Baixa** | Serviços locais tradicionais, competências estáveis                                        | **365 dias** |

**Revisão fora de cadência (obrigatória):** alteração conhecida de regras ou fiscalidade; três ou
mais pivots de utilizadores a partir da mesma entrada; discrepância entre rendimento estimado e
rendimento real registado; queixa sobre informação incorrecta.

O sinal mais valioso vem de dentro: se vários utilizadores abandonam a mesma oportunidade, a entrada
está errada, não os utilizadores.

---

## 5. Checklist de publicação

Uma entrada só passa a `publicado` com todos os pontos verificados:

1. Descrição canónica escrita, sem rendimento garantido nem promessa de resultado
2. Requisitos preenchidos: competências, tempo mínimo semanal, capital mínimo
3. Faixa de rendimento realista, **com fonte e data de consulta**
4. Requisitos legais e fiscais em Portugal verificados e datados, com indicação de que o utilizador
   deve confirmar a sua situação concreta
5. `tipo_oportunidade` (T1–T6) atribuído
6. Playbook base com as três fases (Preparação, Exposição, Conversão) e N1/N2 operacionalizados
   conforme as definições de validação
7. Classe de volatilidade atribuída e `data_proxima_revisao` calculada
8. Regras de elegibilidade determinísticas preenchidas (tempo mínimo, capital mínimo, limitações incompatíveis)
9. Curador atribuído

---

## 6. Fila de candidatas

**Origens:** lacuna de cobertura detectada na correspondência (proposta da IA); pivot de utilizador
com motivo registado; sugestão manual do curador.

**Campos:** origem, descrição, perfil que a originou (anonimizado), contagem de ocorrências, data da
primeira e da última ocorrência, estado de triagem.

**Cadência de triagem:** semanal. **[PRESSUPOSTO: revisão às segundas-feiras]**

**Desfechos:** promover a `rascunho`; fundir com entrada existente; rejeitar com motivo registado.
Rejeições ficam guardadas — se a mesma candidata reaparecer cinco vezes, a rejeição é reavaliada.

**Prioridade:** número de utilizadores distintos que caíram na lacuna. A fila serve para o catálogo
crescer a partir de procura real, não de intuição.

---

## 7. Meta de lançamento e cobertura

**30 entradas publicadas** no lançamento. Quantidade sem cobertura não serve: a matriz mínima é

| Eixo                                        | Mínimo                    |
| ------------------------------------------- | ------------------------- |
| Por tipo (T1–T6)                            | ≥ 3 entradas em cada tipo |
| Capital inicial 0 €                         | ≥ 10 entradas             |
| Viáveis com ≤ 10h/semana (persona primária) | ≥ 12 entradas             |
| Viáveis com > 20h/semana                    | ≥ 6 entradas              |
| Sem experiência comercial prévia            | ≥ 10 entradas             |
| Sem experiência prévia com IA               | ≥ 15 entradas             |

A cobertura é verificável por consulta ao catálogo e deve ser acompanhada durante a curadoria, não
apurada no fim.

---

## 8. Curadoria em paralelo com a engenharia

A curadoria **não bloqueia** o arranque da engenharia. Sequência acordada:

| Momento                             | Meta de catálogo         | Serve para                                                                   |
| ----------------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Durante a Fase 0 (fundação)         | **3 entradas** completas | Validar que o modelo de dados do catálogo aguenta casos reais                |
| Fim da Fase 1 (dados e auth)        | **8 entradas**           | Desenvolver a correspondência com dados verdadeiros, não fixtures inventadas |
| Início da Fase 3 (núcleo funcional) | **15 entradas**          | Testar ranking e cobertura com variedade suficiente                          |
| Lançamento                          | **30 entradas**          | Cumprir a matriz de cobertura de §7                                          |

As três primeiras entradas devem ser deliberadamente diferentes entre si (tipos, capital e tempo
distintos) — servem para partir o modelo de dados cedo, enquanto isso ainda é barato.
