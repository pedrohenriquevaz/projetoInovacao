# Projeto Inovação

Repositório com os materiais do Projeto Inovação 2026 da Siscobra, centrado na proposta QA Inteligente + Release Notes Automático.

A ideia do projeto é encapsular um sistema legado em GeneXus 9 com uma camada externa de inteligência capaz de:

- testar fluxos pela interface com Playwright
- gerar evidências visuais da execução
- apoiar documentação automática
- comunicar entregas ao cliente por meio de release notes mais claros

Este repositório não representa um produto final pronto para produção. Ele concentra a apresentação visual da proposta, os artefatos de apoio e uma prova de conceito de automação.

## Visão geral

O projeto foi estruturado em duas frentes principais:

- uma apresentação executiva e visual da ideia, em HTML estático
- uma POC técnica com Playwright para demonstrar a automação de um fluxo real

Problemas que a proposta busca atacar:

- alto esforço manual para regressão em sistema legado
- risco de bugs em produção e retrabalho
- baixa visibilidade para o cliente sobre o que foi entregue
- documentação técnica e funcional desatualizada

## Estrutura do repositório

```text
.
|-- ideia_08.md
|-- index.html
|-- index_old.html
|-- README.md
|-- Release Notes - Modelo Email.html
|-- roteiro_apresentacao.md
`-- teste/
    |-- contexto.md
    |-- evidencias/
    |-- package.json
    `-- teste_email_cliente.js
```

## O que cada arquivo contem

| Caminho                             | Finalidade                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `index.html`                        | Versão principal da landing page/apresentação do projeto                       |
| `index_old.html`                    | Versão anterior do protótipo visual                                            |
| `ideia_08.md`                       | Documento-base com a proposta, problema, solução, fluxo e resultados esperados |
| `roteiro_apresentacao.md`           | Roteiro detalhado de apresentação para o pitch                                 |
| `Release Notes - Modelo Email.html` | Exemplo visual do e-mail de release notes para cliente                         |
| `teste/contexto.md`                 | Descrição passo a passo do cenário de teste automatizado                       |
| `teste/teste_email_cliente.js`      | Script Playwright da POC                                                       |
| `teste/evidencias/`                 | Screenshots gerados durante a execução do teste                                |

## Tecnologias utilizadas

- HTML5
- CSS
- Node.js
- Playwright

## Como visualizar a apresentação

Não existe etapa de build. O projeto visual pode ser aberto diretamente no navegador.

### Opção 1: abrir o HTML diretamente

No Windows, a partir da raiz do repositorio:

```powershell
start index.html
```

Para abrir o modelo de email:

```powershell
start "Release Notes - Modelo Email.html"
```

### Opção 2: servir localmente

Se preferir abrir por um servidor local:

```powershell
python -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080
```

## Como executar a POC com Playwright

### Pré-requisitos

- Node.js 18+ recomendado
- npm
- acesso ao ambiente de homologação usado no script
- conectividade com a internet para carregar dependências CDN da página visual

### Instalação

```powershell
cd teste
npm install
```

### Execução

```powershell
node teste_email_cliente.js
```

### O que o script faz

O fluxo automatizado atual:

1. acessa a aplicação de homologação
2. realiza login
3. navega pelo menu Acionamento > Pesquisar
4. pesquisa um cliente por CPF/CNPJ
5. abre a ficha do cliente
6. acessa a aba de e-mails
7. adiciona um e-mail do tipo Pesquisa
8. valida que o e-mail foi incluído na lista
9. retorna para a tela de contratos do cliente

### Evidências da execução

Durante a execução, o script salva capturas de tela em `teste/evidencias/`.

A pasta já contém uma execução de exemplo com arquivos como:

- `01_tela_login.png`
- `06_tela_pesquisa.png`
- `10_aba_emails.png`
- `15_email_na_lista.png`
- `16_tela_contratos.png`

## Observações importantes

- O cenário de teste foi construído para um fluxo específico de homologação.
- O `package.json` da pasta `teste/` ainda não expõe um fluxo de teste pronto via `npm test`; a execução atual é feita diretamente com `node teste_email_cliente.js`.

## Impacto esperado da proposta

Com base no material do projeto, os principais ganhos esperados são:

- redução de regressão manual em fluxos críticos
- geração automática de evidências visuais
- apoio à documentação automática em ferramentas como Notion, Swagger e Azure DevOps
- geração de release notes mais claros para o cliente, aumentando a percepção de valor sobre as entregas e interno, mantendo o time alinhado sobre o que foi entregue
- aumento da percepção de valor sobre o que foi entregue

As métricas de ROI e payback apresentadas no pitch devem ser tratadas como estimativas da proposta, não como resultados operacionais já medidos por este repositório.

## Materiais de apoio

- Documento da ideia: `ideia_08.md`
- Roteiro da apresentação: `roteiro_apresentacao.md`
- Modelo de release notes: `Release Notes - Modelo Email.html`
- Contexto do teste automatizado: `teste/contexto.md`

## Equipe citada no material

Segundo o documento-base do projeto, a iniciativa envolve:

- Gabriel
- Vinícius
- Pedro
- Leonardo
- Gabrieli
- Lucas Silva
- André
- Matheus
