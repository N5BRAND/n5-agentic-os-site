/* conteúdo da demo: um negócio do início ao fim. Tudo ilustrativo (nomes, números, mensagens). */

export const PESSOAS = {
  lead: { nome: 'Marta Silva', iniciais: 'MS' },
  consultor: { nome: 'Rui Costa', iniciais: 'RC' },
  broker: { nome: 'Joana Reis', iniciais: 'JR' },
}

export const NEGOCIO = {
  imovel: 'T3 em Benfica, Lisboa',
  valor: '365 000 €',
}

export const CENAS = [
  {
    id: 'lead',
    ilustrativo: true,
    eyebrow: '01 · Lead nova',
    titulo: 'A lead entra. O agente responde em segundos.',
    texto: 'Às 23h de um domingo ou às 9h de uma segunda, a resposta sai na hora. O agente qualifica a lead e passa-a ao consultor certo.',
    origem: 'Portal imobiliário · 23:14',
    mensagens: [
      { de: 'lead', texto: 'Boa noite, vi o T3 em Benfica. Ainda está disponível?' },
      { de: 'agente', texto: 'Boa noite, Marta! Está sim. É para habitação própria? Se quiser, o Rui, consultor responsável, liga-lhe amanhã às 18h.' },
      { de: 'lead', texto: 'É para nós e para os miúdos. Às 18h dá jeito.' },
    ],
    tempoResposta: '41 s',
    etiquetas: ['Habitação própria', 'Família', 'Até 380 mil €', 'Crédito por verificar'],
  },
  {
    id: 'coach',
    ilustrativo: true,
    eyebrow: '02 · Chamada com coach',
    titulo: 'O consultor liga. A IA ouve e diz-lhe como fechar.',
    texto: 'Cada chamada é transcrita e analisada. No fim, o consultor sabe o que correu bem, o que mudar e qual o próximo passo para marcar a reunião.',
    chamada: { duracao: '6:42', com: 'Marta Silva' },
    transcricao: [
      { de: 'consultor', texto: 'Para quando estão a pensar mudar-se?' },
      { de: 'lead', texto: 'Antes do ano letivo, idealmente em julho.' },
      { de: 'consultor', texto: 'Perfeito. E já falaram com algum banco?' },
    ],
    feedback: {
      bem: ['Perguntaste pelo prazo da mudança logo no início', 'Confirmaste a situação do crédito'],
      mal: ['Falaste de preço antes de perceber o que a família precisa'],
      proximo: 'Amanhã às 10h envia as 3 opções em Benfica com escola perto e propõe visita no sábado.',
    },
    pipeline: [
      { rotulo: 'Negócios parados há mais de 7 dias', valor: '4' },
      { rotulo: 'Compradores com crédito aprovado sem visita', valor: '2' },
    ],
    sugestao: 'Liga hoje aos 2 compradores com crédito aprovado: são 18 400 € de comissão prevista em jogo.',
    resultado: 'Reunião marcada · sábado, 11h',
  },
  {
    id: 'reuniao',
    ilustrativo: true,
    eyebrow: '03 · Reunião',
    titulo: 'Sábado, 11h. A reunião que o agente ajudou a marcar.',
    texto: 'O consultor chega preparado: histórico da lead, o que ela procura e o que dizer. Fica livre para o que só ele faz bem.',
    briefing: ['Família com 2 filhos, mudança em julho', 'Orçamento até 380 mil €', 'Escola a menos de 10 min é decisivo'],
  },
  {
    id: 'orquestrador',
    ilustrativo: true,
    eyebrow: '04 · Proposta aceite',
    titulo: 'Proposta aceite. O orquestrador dispara as passagens.',
    texto: 'Uma só ficha do negócio. Cada departamento recebe só o que precisa, com a tarefa já preparada.',
    proposta: '365 000 €',
    passagens: [
      { para: 'Crédito', leva: 'Perfil, valor da proposta, entrada disponível', prepara: 'Processo de crédito aberto' },
      { para: 'Jurídico', leva: 'Partes, imóvel, sinal, data do CPCV', prepara: 'Dossier aberto com checklist' },
      { para: 'Financeiro', leva: 'Valor, partilhas, data prevista', prepara: 'Comissão prevista registada' },
    ],
  },
  {
    id: 'documento',
    ilustrativo: true,
    eyebrow: '05 · Documento em falta',
    titulo: 'Falta um documento. Toda a gente sabe na hora.',
    texto: 'O jurídico deteta o que falta. O consultor recebe o alerta e a lead recebe o pedido no WhatsApp, ao mesmo tempo.',
    falta: 'Comprovativo da origem dos fundos',
    checklist: [
      { doc: 'Cartão de cidadão dos compradores', ok: true },
      { doc: 'Caderneta predial', ok: true },
      { doc: 'Certidão permanente', ok: true },
      { doc: 'Comprovativo da origem dos fundos', ok: false },
    ],
    alertaConsultor: 'Falta o comprovativo da origem dos fundos da Marta para o CPCV de dia 14.',
    whatsapp: 'Olá Marta! Para avançarmos com o CPCV do T3 em Benfica falta o comprovativo da origem dos fundos. Pode enviá-lo por aqui?',
  },
  {
    id: 'broker',
    ilustrativo: true,
    eyebrow: '06 · Tudo junto',
    titulo: 'O broker vê a agência inteira. Sem perguntar a ninguém.',
    texto: 'Funil, previsão de faturação e comissões a caminho, num só ecrã. Broker e consultor, finalmente em sintonia.',
    funil: [
      { fase: 'Leads', valor: 214 },
      { fase: 'Visitas', valor: 61 },
      { fase: 'Propostas', valor: 18 },
      { fase: 'CPCV', valor: 9 },
      { fase: 'Escrituras', valor: 5 },
    ],
    previsao: '86 400 €',
    comissoes: '12',
    alerta: 'Três escrituras deste mês dependem de crédito ainda não aprovado.',
  },
]
