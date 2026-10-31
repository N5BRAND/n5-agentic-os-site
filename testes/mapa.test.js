import { describe, it, expect } from 'vitest'
import { PERCURSO } from '../src/secoes/Mapa.jsx'
import { VALOR_PRE_RESERVA, MENSALIDADE } from '../src/logica/pagamento.js'

describe('percurso de um negócio', () => {
  it('passa pelos departamentos da agência, da lead à direção', () => {
    expect(PERCURSO.map(d => d.id)).toEqual(['portais', 'comercial', 'credito', 'juridico', 'financeiro', 'direcao'])
    for (const d of PERCURSO) expect(d.texto.length).toBeGreaterThan(20)
  })

  it('as condições do N5 Imobiliário ficam como estão, sem os valores da Clara', () => {
    expect(VALOR_PRE_RESERVA).toBe('100 €')
    expect(MENSALIDADE.normal).toBe('299 €')
    expect(JSON.stringify(PERCURSO)).not.toMatch(/27 €|IVA/)
  })
})
