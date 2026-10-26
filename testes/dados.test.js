import { describe, it, expect } from 'vitest'
import { CENAS } from '../src/demo/dados.js'

describe('dados da demo', () => {
  it('tem seis cenas pela ordem combinada', () => {
    expect(CENAS.map(c => c.id)).toEqual(['lead', 'coach', 'reuniao', 'orquestrador', 'documento', 'broker'])
  })
  it('todas as cenas estão marcadas como ilustrativas', () => {
    expect(CENAS.every(c => c.ilustrativo === true)).toBe(true)
  })
  it('nenhum texto fala em aprovação, consentimento ou usa travessões', () => {
    const texto = JSON.stringify(CENAS)
    // «crédito aprovado» é permitido; aprovar mensagens não
    expect(texto).not.toMatch(/aprovação|aprovar|consentimento|—/i)
  })
})
