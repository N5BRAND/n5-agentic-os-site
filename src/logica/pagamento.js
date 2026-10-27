/* pré-reserva de 100 € paga num Payment Link da Stripe: a Stripe mostra MB WAY, Multibanco,
   cartão, Apple Pay e Google Pay conforme os métodos ligados na conta. O site não guarda chaves.
   Enquanto o link não existir, o passo 3 diz que o link segue por email. */
export const LINK_PRE_RESERVA = 'https://buy.stripe.com/cNibJ31OFc4DbUr3DUgrS09'

export const VALOR_PRE_RESERVA = '100 €'

/* mensalidade no lançamento, mostrada ao lado da pré-reserva */
export const MENSALIDADE = { normal: '299 €', desconto: 50, comDesconto: '149,50 €' }

export const METODOS = ['MB WAY', 'Multibanco', 'Cartão', 'Apple Pay', 'Google Pay']

/* só aceita links da Stripe, para o botão nunca levar a outro sítio */
export const linkValido = url => /^https:\/\/(buy|checkout)\.stripe\.com\/[\w/-]+$/.test(String(url || ''))
