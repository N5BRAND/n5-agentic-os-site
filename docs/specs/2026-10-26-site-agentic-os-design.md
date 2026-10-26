# Site do Nº5 Agentic OS: desenho

26/10/2026 · Pedro Ferreira

## Objetivo

Página única que mostra o Nº5 Agentic OS a funcionar e leva agências imobiliárias em Portugal a inscreverem-se na lista de espera da pré-venda. Quem lê é o broker ou dono de agência. Ao fim do scroll tem de perceber o que é o sistema, como um negócio corre dentro dele e o que ganha com isso.

Fonte do produto: `Arquitetura/N5-Agentic-OS-esboco-do-sistema-v2.pdf`.

Fora de âmbito: a Terrae (não aparece no site), subdomínio próprio (fica o endereço do Netlify), preços, versão em inglês.

## Mensagem

- Promessa: um só sítio onde o broker controla toda a operação, do primeiro contacto à comissão paga.
- Três eixos: controlar a operação, ligar os departamentos, saber o dinheiro.
- Princípio: a IA trata do trabalho repetitivo sozinha (respostas a leads, qualificação, marcação de reuniões, avisos de documentos em falta ao consultor e à lead por WhatsApp, coaching de chamadas, passagens entre departamentos) e o consultor fica livre para fechar negócios.
- O site não fala em aprovação de mensagens a clientes.

## Estrutura da página

1. **Hero.** Título, subtítulo, botão para a pré-venda e um mini painel que se anima sozinho.
2. **A demo** (o centro da página, ver abaixo).
3. **Cada pessoa vê o seu ecrã.** Seletor de papel (broker, consultor, crédito, jurídico, financeiro) que troca o ecrã sobre os mesmos dados, com o alerta típico de cada papel (exemplos do PDF).
4. **Mapa do sistema.** As camadas do PDF montam-se em sequência com o scroll: agentes por departamento, orquestrador, ficha única, copiloto, dados e ligações, API (só entrada) e MCP (com as permissões de cada utilizador).
5. **Três perfis.** Comprador, vendedor e investidor, cada um com o seu percurso, que se juntam no jurídico, na escritura e na comissão.
6. **Conformidade de origem.** AMI, AML e RGPD dentro do processo.
7. **Pré-venda.** Ver secção própria.
8. **Rodapé.** Símbolo, `numerocinco.pt`, `@somosnumero5`, política de privacidade.

## A demo: um negócio do início ao fim

Um palco fixo no ecrã (`position: sticky`) durante cerca de 700vh de scroll. O progresso do scroll (`useScroll` + `useTransform`) escolhe a cena e o avanço dentro dela. A ficha do negócio é o fio condutor: um cartão que muda de lugar e de conteúdo entre cenas (`layoutId`), em vez de cortes secos. Mensagens, alertas e notificações entram e saem com `AnimatePresence` e molas.

Cenas, por ordem:

1. **A lead entra e o agente responde sozinho.** A lead chega de um portal; em segundos o agente de leads responde, qualifica-a e propõe falar com o consultor. Sem intervenção do consultor.
2. **O consultor liga, a IA faz de coach.** O consultor liga à lead. A chamada é transcrita e no fim aparece o feedback: o que correu bem, o que correu mal, o que fazer no próximo follow-up para fechar a reunião. Ao lado, a leitura do pipeline do consultor e sugestões para aumentar a faturação. O follow-up recomendado acontece e a reunião fica marcada.
3. **Consultor e lead encontram-se.** Na reunião que ficou marcada, aperto de mão animado.
4. **Proposta aceite, entra o orquestrador.** A ficha divide-se em passagens que voam para o crédito, o jurídico e o financeiro, cada uma com o seu pacote de informação (tabela de passagens do PDF).
5. **Documento em falta.** O jurídico deteta-o; o consultor recebe o alerta e a lead recebe a mensagem no WhatsApp, ao mesmo tempo.
6. **Tudo junto.** O ecrã do broker junta funil, previsão de faturação e comissões a caminho. Fecha com broker e consultor a darem um aperto de mão: finalmente em sintonia, cada um a fazer o que sabe.

Indicador lateral com as seis cenas, clicável, para saltar entre elas.

Os apertos de mão são ilustrações SVG próprias animadas com Motion, no estilo da marca (traço simples, tinta e creme, realce dourado).

## Pré-venda

- Lançamento a 1 de dezembro de 2026.
- Antes disso há uma pré-venda; quem está na lista de espera é avisado primeiro.
- 200 licenças reservadas com 50% de desconto.
- Contagem decrescente até 1 de dezembro.
- Formulário: nome, email, telefone, nome da agência, número de consultores, consentimento RGPD obrigatório. Sem pré-preenchimento.
- Envio por Netlify Forms (sem chaves no site). Mais tarde pode reencaminhar-se para o GHL por webhook.
- Campo obrigatório: licença AMI.
- Depois de enviar: mensagem de confirmação na própria página.

### Atualização de 26/10 (feedback do Pedro)

- Tudo é lançado a 1 de dezembro, de uma vez. Não há etiquetas «A seguir».
- Reservámos 200 licenças com 50% de desconto para a lista de espera.
- O formulário pede a licença AMI da agência (obrigatória, guardada só com os dígitos).
- Os três eixos ganham uma secção própria: o scroll envolve cada um em dourado, um de cada vez.
- A demo é um caminho na rua: o cenário desliza com o scroll, com uma paragem por cena. A lead aparece a tocar no telemóvel, o consultor com auscultadores na chamada, consultor e lead à mesa a conversar, e um agente de IA a falar com cada departamento na proposta.
- O mapa do sistema passa a polvo: o Agentic OS ao centro, um braço para o ChatGPT e Claude, o copiloto no CRM, as conversas, os portais e cada departamento, com a passagem ativa a circular.
- Os três perfis são percursos animados pelo scroll: matching, entraves com sugestões, CPCV e AML, escritura e comissão.

## Marca

Segue a skill `marca-numero5`:
- Símbolo: só o SVG oficial (diagonal dourada `#E8A13C`).
- Cores: dourado `#E8A13C`, dourado escuro `#B4761A`, tinta `#15181D`, creme `#F5F4F0`, cobalto `#2B44E7` só para números.
- Letra: Bricolage Grotesque 800 nos títulos, Archivo no corpo, mono nos rótulos.
- PT-PT, tratamento por tu, sem travessões, 0 a 1 emoji.

## Regras de conteúdo

- Todos os nomes, números, mensagens e alertas da demo são ilustrativos e o site diz isso de forma visível («Dados ilustrativos»).
- Não aparecem índices Jev, métricas internas, clientes, testemunhos nem preços.
- Não se prometem resultados garantidos.

## Técnica

- Projeto `Website/` com Vite, React e `motion` (versão fixa do npm). O clone `motion/` serve só de referência.
- Componentes por secção (`src/secoes/`) e por cena da demo (`src/demo/cenas/`); os dados ilustrativos num só ficheiro (`src/demo/dados.js`); a lógica que converte progresso de scroll em cena numa função pura (`src/demo/linha-tempo.js`).
- `prefers-reduced-motion`: as cenas aparecem empilhadas e estáticas, com o mesmo conteúdo.
- Telemóvel: o palco fixo passa a uma coluna, a ficha encolhe e as passagens descem em vez de voar para os lados.
- Desempenho: só se animam `transform` e `opacity`; imagens e ilustrações em SVG.

## Testes e verificação

- `vitest`: linha do tempo (progresso → cena e avanço), todas as entradas de `dados.js` marcadas como ilustrativas, validação do formulário (consentimento obrigatório, email válido).
- Build de produção sem erros.
- Verificação no browser em computador e telemóvel: scroll completo da demo, movimento reduzido, envio do formulário em ambiente de teste.

## Entrega

Pasta local → GitHub (repositório novo) → Netlify (site novo, endereço `*.netlify.app`). Criar o repositório e o site no Netlify só depois do OK do Pedro.
