const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const vazio = v => String(v ?? '').trim() === ''

/* a licença AMI escreve-se de muitas formas («AMI 4719», «ami-4719»); guardamos só os dígitos */
export const normalizarAmi = v => String(v ?? '').trim().replace(/^ami[\s\-:.]*/i, '').trim()

/* valida a inscrição na lista de espera; devolve { ok, erros } com uma mensagem por campo */
export function validarInscricao(d) {
  const erros = {}
  if (vazio(d.nome)) erros.nome = 'Diz-nos o teu nome.'
  if (!EMAIL.test(String(d.email ?? '').trim())) erros.email = 'Este email não parece válido.'
  if (vazio(d.agencia)) erros.agencia = 'Qual é a tua agência?'
  if (!/^\d{3,6}$/.test(normalizarAmi(d.ami))) erros.ami = 'Indica o número da licença AMI (3 a 6 dígitos).'
  if (!vazio(d.telefone)) {
    const digitos = String(d.telefone).replace(/\D/g, '')
    if (digitos.length < 9 || digitos.length > 15) erros.telefone = 'O telefone tem de ter entre 9 e 15 dígitos.'
  }
  if (!vazio(d.consultores)) {
    const n = Number(String(d.consultores).trim())
    if (!Number.isInteger(n) || n < 1) erros.consultores = 'Indica um número inteiro de consultores.'
  }
  if (d.consentimento !== true) erros.consentimento = 'Precisamos da tua autorização para te contactar.'
  return { ok: Object.keys(erros).length === 0, erros }
}
