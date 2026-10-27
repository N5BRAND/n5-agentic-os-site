/* passo 2 da inscrição: o que é mais importante para a agência, em palavras simples.
   Escolhe-se até MAX_PRIORIDADES, para obrigar a escolher a sério. */
export const MAX_PRIORIDADES = 3

export const PRIORIDADES = [
  { id: 'leads', texto: 'Responder às leads a qualquer hora' },
  { id: 'chamadas', texto: 'A IA ouvir as chamadas e dizer como fechar' },
  { id: 'departamentos', texto: 'Passar os negócios entre comercial, crédito, jurídico e financeiro' },
  { id: 'documentos', texto: 'Pedir e controlar os documentos do CPCV e da escritura' },
  { id: 'painel', texto: 'Ver a agência inteira num só ecrã' },
  { id: 'comissoes', texto: 'Saber que comissões vêm a caminho e a quem se pagam' },
  { id: 'carteira', texto: 'Encontrar compradores e investidores na nossa carteira' },
  { id: 'formacao', texto: 'Formar a equipa' },
]

/* o CRM que a agência usa hoje, para preparar a ligação */
export const CRMS = ['eGO', 'Improxy', 'CRM da rede (RE/MAX, KW, ERA, Century 21…)', 'Outro', 'Não usamos CRM']

/* liga ou desliga uma prioridade; com o máximo atingido, não acrescenta mais */
export function alternarPrioridade(escolhidas, id, max = MAX_PRIORIDADES) {
  if (escolhidas.includes(id)) return escolhidas.filter(x => x !== id)
  if (escolhidas.length >= max || !PRIORIDADES.some(p => p.id === id)) return escolhidas
  return [...escolhidas, id]
}

/* texto que segue no envio: as escolhas pela ordem em que foram feitas */
export const textoPrioridades = escolhidas =>
  escolhidas.map(id => PRIORIDADES.find(p => p.id === id)?.texto).filter(Boolean).join('; ')
