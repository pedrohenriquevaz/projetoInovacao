# Roteiro de Apresentação — QA Inteligente + Release Notes Automático
**Projeto Inovação 2026 — Siscobra Sistemas**
Apresentadores: **Gabriel** · **Vinicius**
Referência visual: https://pedrohenriquevaz.github.io/projetoInovacao/

---

> **Convenção:** `[G]` = Gabriel fala | `[V]` = Vinicius fala | `[→]` = navegar para próxima seção | `[*]` = dica de postura/ritmo

---

## ABERTURA — Hero da página

**[G]**
> "Bom dia a todos. Hoje vamos apresentar a ideia vencedora do Projeto Inovação 2026 — e eu garanto que quando a gente terminar, vocês vão enxergar de um ângulo completamente diferente o que significa entregar software com qualidade na Siscobra."

**[G]**
> "O projeto se chama **QA Inteligente + Release Notes Automático**. O conceito central é simples: ao invés de reescrever o nosso sistema legado — o GeneXus 9 — a gente constrói uma camada de inteligência em volta dele. Uma camada que **testa por fora, documenta automaticamente e comunica ao cliente** o que foi entregue."

**[G]**
> "Quem vai me acompanhar nessa apresentação é o Vinicius, que vai falar especialmente sobre o impacto de negócio e o retorno que essa solução traz."

`[*]` Pausa curta, deixar o visual da página carregar.

---

## SEÇÃO 1 — O Desafio do Sistema Legado
`[→]` Rolar até "Cenário Atual" / "O Desafio do Sistema Legado"

**[V]**
> "Para entender por que essa ideia faz sentido agora, a gente precisa ser honesto sobre onde estamos hoje."

**[V]**
> "O GeneXus 9 não tem suporte nativo a testes automatizados. O que isso significa na prática? Significa que toda vez que a gente faz um deploy, está fazendo uma aposta. Cada mudança pode quebrar algo que funcionava. E sem cobertura automática, a gente só descobre quando o cliente liga."

**[V]**
> "Isso gera um ciclo que a gente conhece bem: bug em produção → cliente insatisfeito → multa contratual → retrabalho → mais risco no próximo deploy. E o ciclo recomeça."

`[*]` Tom de diagnóstico — direto, sem exagero. Dados que todos reconhecem.

---

## SEÇÃO 2 — Por Que Agir Agora?
`[→]` Rolar até "Por que agir agora?"

**[V]**
> "E aqui está o ponto central que justifica agir agora: **não precisamos reescrever o legado para parar de perder dinheiro.**"

**[V]**
> "Olhando para os últimos 12 meses: média de 3,2 incidentes críticos por mês em produção. Aproximadamente 18 horas gastas com testes manuais repetitivos por sprint. Mais 12 horas de retrabalho por regressões. Isso representa entre R$ 15.000 e R$ 25.000 por mês em custo operacional — sem contar multas contratuais."

**[V]** *(Apontando para o comparativo na tela)*
> "À esquerda, o cenário atual: multas contratuais, testes lentos e repetitivos, limitação técnica do GeneXus. À direita, com a camada de IA: regressão 100% automatizada, notas de atualização com evidências visuais e fim das multas."

**[G]**
> "A nossa proposta é exatamente isso que o Vinicius mostrou: **encapsular o legado** com inteligência externa. O Playwright testa por fora da aplicação. A IA corrige os fluxos e automatiza a burocracia. E o resultado é mensurável desde o primeiro sprint."

`[*]` Gabriel retoma o fio condutor — passa de diagnóstico para solução.

---

## SEÇÃO 3 — Etapas da Solução
`[→]` Rolar até "Etapas da Solução"

**[G]**
> "A solução funciona em três etapas integradas."

**[G]** *(Etapa 01)*
> "Primeiro: **geração de casos de teste**. Quando um PBI é registrado no Azure DevOps, a IA lê o contexto, entende o que precisa ser validado e já gera os roteiros de teste — positivos e negativos. Sem ninguém digitando um cenário de teste manualmente."

**[G]** *(Etapa 02)*
> "Segundo: **mock inteligente**. A IA gera os dados de teste de forma realista e segura. Nada de copiar dados de produção e a geração é instantânea, sob demanda."

**[G]** *(Etapa 03)*
> "Terceiro: **documentação automática**. À medida que os testes rodam, os resultados são sincronizados em tempo real com o Notion, o Swagger e o Azure. Uma única fonte da verdade, sempre atualizada."

`[*]` Mostrar cada etapa no scroll — não avançar rápido demais.

---

## SEÇÃO 4 — Entrega de Valor: Release Notes
`[→]` Rolar até "Entrega de Valor: Release Notes"

**[V]**
> "Agora eu quero mostrar uma das partes que mais me empolgou nesse projeto."

**[V]**
> "Ao final de cada sprint, a IA analisa todos os cards marcados como Done e gera o **Release Notes automaticamente**. Mas não um relatório técnico cheio de jargão — uma comunicação em linguagem acessível, personalizada por cliente, com evidências visuais das telas."

**[V]**
> "Hoje, montar um release notes manualmente leva de 4 a 6 horas. Com a solução, são **2 minutos de geração automática**, com revisão humana antes do envio para garantir o tom certo."

**[V]**
> "O impacto nisso é duplo: menos tickets de suporte — porque o cliente já sabe o que mudou — e uma percepção muito maior de valor entregue. Pesquisas de mercado mostram 30 a 50% menos tickets e NPS 15 a 25 pontos maior em empresas que adotam comunicação proativa com o cliente."

`[*]` Esse é o ponto de maior conexão com o negócio — falar com convicção.

---

## SEÇÃO 5 — Visão Geral da Arquitetura
`[→]` Rolar até "Visão Geral da Arquitetura"

**[G]**
> "Quero mostrar agora como tudo isso funciona tecnicamente — mas de forma que fique claro para todo mundo."

**[G]** *(Pipeline: Input → Orquestração → Executor)*
> "O fluxo começa com uma entrada de teste — pode ser uma descrição de negócio vinda do Azure, pode ser um prompt em linguagem natural. Essa entrada vai para um **orquestrador MCP**, que decide qual caminho tomar. Depois, o **Playwright executa** os testes de ponta a ponta na interface do sistema."

**[G]**
> "O diferencial está em dois modos de operação que o sistema usa de forma híbrida."

---

## SEÇÃO 6 — Dois Cenários de Operação
`[→]` Rolar até "Dois Cenários de Operação"

**[G]** *(Determinístico)*
> "Para os fluxos críticos e conhecidos — login, cálculo de cobrança, emissão de boleto — o sistema opera em modo **determinístico**: velocidade máxima, resultado previsível, sem surpresas."

**[G]** *(Semântico / IA)*
> "Para cenários mais complexos ou situações novas, ele entra no modo **semântico com IA**: adapta o teste com base na intenção, interpreta variações e aprende com o histórico de execuções."

**[V]**
> "O que isso significa na prática? Que a solução não quebra quando a interface muda. Ela tenta se adaptar — **self-healing** — antes de emitir um erro."

---

## SEÇÃO 7 — Fluxo Híbrido e Tomada de Decisão
`[→]` Rolar até "Fluxo Híbrido e Tomada de Decisão"

**[G]**
> "A inteligência do sistema está na forma como ele toma decisões."

**[G]**
> "Se a confiança no histórico de execuções é alta — ele executa diretamente. Se o contexto é novo ou houve erro — faz fallback automático para o fluxo determinístico. E em ambos os casos, alimenta a base de conhecimento para a próxima execução ser mais precisa."

**[G]**
> "Isso é aprendizado contínuo. O sistema fica melhor a cada sprint."

---

## SEÇÃO 8 — Fluxo Inteligente do Processo
`[→]` Rolar até "Fluxo Inteligente do Processo"

**[V]**
> "Vou mostrar agora o fluxo completo do processo, do início ao fim."

**[V]** *(Narrando cada etapa)*
> "Uma Feature chega do Azure com a descrição de negócio. A IA cria os critérios de aceitação. Um humano valida e confirma — a IA não substitui o julgamento, ela acelera. Com isso confirmado, a IA lê as instruções e gera os scripts Playwright prontos para rodar. E ao final, sincroniza tudo via API para Azure, Notion e Swagger."

**[V]**
> "Da Feature ao teste automatizado, sem uma linha de script escrita manualmente."

---

## SEÇÃO 9 — Ciclo de Execução Playwright
`[→]` Rolar até "Ciclo de Execução Playwright"

**[G]**
> "A execução em si funciona em quatro fases que eliminam os principais pontos de dor do GeneXus."

**[G]**
> "**Smart Locators**: em vez de depender dos IDs dinâmicos que o GeneXus 9 gera — que mudam a cada release — o Playwright identifica elementos por role ou test-id. Estável."

**[G]**
> "**Paralelismo**: os testes rodam em múltiplos browsers simultaneamente, com auto-waiting nativo. Resultado rápido, sem esperas artificiais."

**[G]**
> "**Self-Healing**: se a IA detecta uma mudança de interface, sugere a correção em tempo real antes de falhar o teste."

**[G]**
> "E por fim, **Evidências**: Trace Viewer com vídeos e logs, anexados automaticamente ao Azure DevOps. Chega de 'mas funciona na minha máquina'."

---

## SEÇÃO 10 — Retorno (ROI)
`[→]` Rolar até "Retorno (ROI)"

**[V]**
> "Agora os números que justificam o investimento."

**[V]** *(Destacando os percentuais na tela)*
> "Geração de testes: **87% de automação**. Mock inteligente: **99%**. Testes E2E: **95%**. Release notes: **99%**."

**[V]**
> "Em termos financeiros: o investimento é de aproximadamente 320 horas de desenvolvimento. A economia mensal projetada é de R$ 14.000 — somando redução de testes manuais, eliminação de retrabalho, redução de multas e menos tickets de suporte. O **payback é entre 4 e 5 meses**."

**[V]**
> "ROI anual projetado em premissa conservadora: **340%**."

**[V]**
> "E isso sem precificar os ganhos intangíveis: redução de churn, confiança no deploy, diferencial comercial com o release notes como feature vendável."

`[*]` Pausa depois dos números. Deixar o impacto assentar.

---

## ENCERRAMENTO

**[G]**
> "Para fechar, o plano de implantação é em 4 fases incrementais, cada uma entregando valor independente."

**[G]**
> "Fase 1 — 2 semanas: Elaboração de prompts e revisão completa de fluxo de testes. Fase 2 — mais 4 semanas: Decisões técnicas e implementação inicial. Fase 3 — 4 semanas: documentação automática no Notion e Swagger e release notes automático (Interno e cliente). Fase 4 — 1 semana: Treinamento com equipe."

**[G]**
> "Totalizando em: 11 semanas."

**[V]**
> "Os riscos estão mapeados. O maior deles — release notes com informação incorreta — está mitigado com revisão humana obrigatória antes do envio. A IA sugere, o humano aprova."

**[G]**
> "Os próximos passos são simples: validar os fluxos prioritários com o time de QA, configurar o ambiente Playwright e definir os prompts otimizados para o contexto da Siscobra."

**[G]**
> "**Zero regressões. Zero manual. Cliente informado.** Essa é a proposta. Obrigado."

`[*]` Abrir para perguntas em conjunto.

---

## Referências Rápidas (para perguntas)

| Dado                    | Valor                          |
| ----------------------- | ------------------------------ |
| Custo operacional atual | R$ 15k–25k/mês                 |
| Economia projetada      | ~R$ 14k/mês                    |
| Payback                 | 4–5 meses                      |
| ROI anual               | 340%                           |
| Investimento            | ~320h                          |
| Bugs em prod atual      | 3,2/mês                        |
| Bugs com solução        | ~0,5/mês                       |
| Testes manuais/sprint   | 18h → 3h                       |
| Tempo de release notes  | 4–6h → 15min                   |
| Cobertura projetada     | 85% fluxos críticos em 6 meses |
| Self-healing rate       | ~70%                           |
| Tempo de feedback (PR)  | <10min (vs. 2–3 dias)          |
