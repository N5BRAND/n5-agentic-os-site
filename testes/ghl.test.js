import { describe, it, expect, vi } from 'vitest'
import { paraGhl, telefone, enviarParaGhl } from '../netlify/ghl.js'

describe('GHL', () => {
  it('passa a inscrição da pré-venda com a licença AMI na nota', () => {
    const r = paraGhl('pre-venda', { nome: 'Ana Sousa Lima', email: 'ana@agencia.pt', telefone: '912 345 678', agencia: 'Agência Lima', ami: '12345', consultores: '' })
    expect(r.contacto).toEqual({ firstName: 'Ana', lastName: 'Sousa Lima', email: 'ana@agencia.pt', phone: '+351912345678', companyName: 'Agência Lima', source: 'Site N5 Imobiliário' })
    expect(r.etiquetas).toEqual(['n5-imobiliario', 'lista-pre-venda'])
    expect(r.nota).toContain('Licença AMI: 12345')
    expect(r.nota).toContain('Consultores: não indicado')
  })

  it('passa as prioridades numa nota', () => {
    const r = paraGhl('prioridades', { email: 'a@b.pt', prioridades: 'Responder às leads; Organizar o dia' })
    expect(r.contacto).toEqual({ email: 'a@b.pt' })
    expect(r.etiquetas).toContain('prioridades-respondidas')
    expect(r.nota).toContain('Responder às leads; Organizar o dia')
  })

  it('ignora formulários desconhecidos e envios sem email', () => {
    expect(paraGhl('outro', { email: 'a@b.pt' })).toBeNull()
    expect(paraGhl('prioridades', { email: '' })).toBeNull()
  })

  it('normaliza telefones portugueses', () => {
    expect(telefone('912 345 678')).toBe('+351912345678')
    expect(telefone('+351 912 345 678')).toBe('+351912345678')
    expect(telefone('00351912345678')).toBe('+351912345678')
    expect(telefone('')).toBeUndefined()
  })

  it('cria o contacto, junta as etiquetas e deixa a nota, com o token só no cabeçalho', async () => {
    const pedir = vi.fn(async url => ({ ok: true, json: async () => (url.endsWith('/upsert') ? { contact: { id: 'c1' } } : {}) }))
    const r = await enviarParaGhl({ formulario: 'pre-venda', dados: { nome: 'Ana', email: 'ana@agencia.pt', agencia: 'A', ami: '1' }, token: 'tk', localizacao: 'loc', pedir })
    expect(r).toEqual({ ok: true, id: 'c1' })
    expect(pedir.mock.calls.map(c => c[0])).toEqual([
      'https://services.leadconnectorhq.com/contacts/upsert',
      'https://services.leadconnectorhq.com/contacts/c1/tags',
      'https://services.leadconnectorhq.com/contacts/c1/notes',
    ])
    expect(JSON.parse(pedir.mock.calls[0][1].body).locationId).toBe('loc')
    expect(pedir.mock.calls[0][1].headers.Authorization).toBe('Bearer tk')
    expect(pedir.mock.calls.every(c => !c[1].body.includes('tk'))).toBe(true)
  })
})
