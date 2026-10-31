import { describe, it, expect, vi, afterEach } from 'vitest'
import { idDaCompra, cliqueSimples } from '../src/legal/pixel.js'
import { CHAVE, novoConsentimento } from '../src/legal/consentimento.js'

/* navegador falso, com ou sem os cookies de marketing aceites */
async function pixelNoNavegador({ marketing, dominio = 'agentic.numerocinco.pt' }) {
  vi.resetModules()
  vi.useFakeTimers()
  const guardado = { [CHAVE]: JSON.stringify(novoConsentimento({ marketing })) }
  vi.stubGlobal('window', {
    location: { hostname: dominio, search: '' },
    localStorage: { getItem: k => guardado[k] ?? null },
    addEventListener: () => {},
  })
  vi.stubGlobal('document', {
    visibilityState: 'visible',
    createElement: () => ({}),
    head: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
  })
  vi.stubGlobal('navigator', { webdriver: false })
  const pixel = await import('../src/legal/pixel.js')
  pixel.iniciarPixel()
  return pixel
}

const fila = () => window.fbq.queue.map(a => [...a])

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('píxel da Meta', () => {
  it('PageView só depois de 6 segundos à vista, e nunca sozinho quando o endereço muda', async () => {
    await pixelNoNavegador({ marketing: true })
    expect(window.fbq.disablePushState).toBe(true)
    expect(fila()).toEqual([['init', '2268439390668297']])
    vi.advanceTimersByTime(6000)
    expect(fila()).toEqual([['init', '2268439390668297'], ['track', 'PageView']])
  })

  it('fora do domínio real não carrega', async () => {
    await pixelNoNavegador({ marketing: true, dominio: 'n5-agentic-os.netlify.app' })
    expect(window.fbq).toBeUndefined()
  })

  it('envia o evento com o id', async () => {
    const { evento } = await pixelNoNavegador({ marketing: true })
    expect(evento('Lead', { content_category: 'demonstracao' }, 'b1f0c2d4-1111')).toBe(true)
    expect(fila().at(-1)).toEqual(['track', 'Lead', { content_name: 'N5 Imobiliário', content_category: 'demonstracao' }, { eventID: 'b1f0c2d4-1111' }])
  })

  it('sem os cookies de marketing não envia nada e diz que não enviou', async () => {
    const { evento } = await pixelNoNavegador({ marketing: false })
    expect(window.fbq).toBeUndefined()
    expect(evento('InitiateCheckout', { value: 100, currency: 'EUR' }, 'x')).toBe(false)
  })
})

describe('id da compra', () => {
  it('lê o id da sessão da Stripe do endereço de retorno', () => {
    expect(idDaCompra('?session_id=cs_live_a1B2c3D4e5')).toBe('cs_live_a1B2c3D4e5')
  })

  it('sem id da Stripe (página aberta à mão, ou modelo por preencher) não há compra', () => {
    expect(idDaCompra('')).toBeNull()
    expect(idDaCompra('?session_id={CHECKOUT_SESSION_ID}')).toBeNull()
  })
})

describe('clique no botão de pagar', () => {
  it('só espera pelo píxel no clique normal', () => {
    const clique = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }
    expect(cliqueSimples(clique)).toBe(true)
    expect(cliqueSimples({ ...clique, ctrlKey: true })).toBe(false)
  })
})
