import { lerConsentimento } from './consentimento.js'
import { PRODUTO } from './produto.js'
import { quandoVisivel, SEGUNDOS_VISUALIZACAO } from './tempoVisivel.js'
import { emTeste } from './teste.js'

/* Píxel da Meta: o conjunto de dados «Nº5», o mesmo de numerocinco.pt.
   Só carrega depois de o visitante aceitar os cookies de marketing; sem isso, nada sai para a Meta.
   O PageView só sai depois de 6 segundos com a página à vista, como na N5 Clara: quem clica e sai logo, e os
   robôs, não contam como visualização da página de destino na Meta. */
export const PIXEL_ID = '2268439390668297'

/* só no domínio real: pré-visualizações e endereços da Netlify não contam na Meta */
const DOMINIOS = ['agentic.numerocinco.pt']

let carregado = false
let consentido = false
let ficou = false
let pageView = false

function enviarPageView() {
  if (consentido && carregado && ficou && !pageView) {
    window.fbq('track', 'PageView')
    pageView = true
  }
}

/* código base da Meta, carregado só quando há consentimento */
function carregar() {
  if (window.fbq) return
  const n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
  if (!window._fbq) window._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  /* sem isto, o píxel conta um PageView a cada mudança do endereço (um clique numa âncora, por exemplo), por fora dos 6 segundos */
  n.disablePushState = true
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
}

function aplicar(c) {
  consentido = !!c?.marketing
  if (consentido && !carregado) {
    carregar()
    window.fbq('init', PIXEL_ID)
    carregado = true
    enviarPageView()
  } else if (carregado) {
    window.fbq('consent', consentido ? 'grant' : 'revoke')
    enviarPageView()
  }
}

/* uma vez por página: aplica a escolha guardada e acompanha as mudanças no aviso de cookies */
export function iniciarPixel() {
  /* em modo de teste nada sai para a Meta (ver teste.js) */
  if (!DOMINIOS.includes(window.location.hostname) || emTeste()) return
  let c = null
  try { c = lerConsentimento(window.localStorage) } catch { /* sem armazenamento: fica desligado */ }
  aplicar(c)
  window.addEventListener('consentimento-mudou', e => aplicar(e.detail))
  quandoVisivel(SEGUNDOS_VISUALIZACAO, () => { ficou = true; enviarPageView() })
}

/* eventos só seguem com consentimento; com id, a Meta pode juntar este evento a um igual enviado pelo servidor
   (API de Conversões, quando o N5 Imobiliário a tiver). Diz se o evento seguiu. */
export function evento(nome, dados = {}, id) {
  if (!consentido || !window.fbq) return false
  window.fbq('track', nome, { content_name: PRODUTO.nome, ...dados }, ...(id ? [{ eventID: id }] : []))
  return true
}

/* id único de cada evento */
export const novoIdEvento = () => window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`

/* o píxel envia por imagem: se a página muda logo para a Stripe, o navegador pode cortar o pedido.
   Depois de um evento, o botão espera este tempo antes de seguir. */
export const ESPERA_ANTES_DE_SAIR = 300

/* clique normal, sem teclas: os outros (abrir noutro separador) seguem como o navegador quiser */
export const cliqueSimples = e => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

/* id da sessão de pagamento que a Stripe põe no endereço de retorno (?session_id={CHECKOUT_SESSION_ID} no Payment Link).
   Serve de id do Purchase: uma compra, um evento, e quem abre a página sem ter passado pela Stripe não conta. */
export function idDaCompra(search = typeof window === 'undefined' ? '' : window.location.search) {
  const id = new URLSearchParams(search).get('session_id') || ''
  return /^cs_(live|test)_[A-Za-z0-9]+$/.test(id) ? id : null
}
