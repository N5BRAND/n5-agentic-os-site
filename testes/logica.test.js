import { describe, it, expect } from 'vitest'
import { cenaDe, passoDe } from '../src/logica/linha-tempo.js'
import { validarInscricao, normalizarAmi } from '../src/logica/validar.js'
import { LANCAMENTO, tempoAte } from '../src/logica/contagem.js'
import { codificar } from '../src/logica/netlify.js'

describe('cenaDe', () => {
  it('início é a primeira cena sem avanço', () => {
    expect(cenaDe(0, 6)).toEqual({ indice: 0, avanco: 0 })
  })
  it('meio de 6 cenas é o início da quarta', () => {
    expect(cenaDe(0.5, 6)).toEqual({ indice: 3, avanco: 0 })
  })
  it('fim é a última cena completa', () => {
    expect(cenaDe(1, 6)).toEqual({ indice: 5, avanco: 1 })
  })
  it('valores fora do intervalo ficam presos aos limites', () => {
    expect(cenaDe(-0.3, 6)).toEqual({ indice: 0, avanco: 0 })
    expect(cenaDe(NaN, 6)).toEqual({ indice: 0, avanco: 0 })
    expect(cenaDe(1.7, 6)).toEqual({ indice: 5, avanco: 1 })
  })
  it('avanço dentro da cena', () => {
    const r = cenaDe(0.25, 2)
    expect(r.indice).toBe(0)
    expect(r.avanco).toBeCloseTo(0.5)
  })
})

describe('passoDe', () => {
  it('o primeiro passo aparece logo à entrada da cena', () => {
    expect(passoDe(0, 4)).toBe(1)
  })
  it('avança um passo por cada fração da cena', () => {
    expect(passoDe(0.26, 4)).toBe(2)
    expect(passoDe(0.5, 4)).toBe(3)
  })
  it('o último passo fica à vista até ao fim', () => {
    expect(passoDe(0.8, 4)).toBe(4)
    expect(passoDe(1, 4)).toBe(4)
    expect(passoDe(NaN, 4)).toBe(1)
  })
})

describe('pedido de demonstração', () => {
  it('obriga ao telefone só quando se pede a demonstração', () => {
    const d = { nome: 'Rui', email: 'rui@agencia.pt', telefone: '', agencia: 'A', ami: '4719', consultores: '', consentimento: true }
    expect(validarInscricao(d).ok).toBe(true)
    expect(validarInscricao(d, { telefoneObrigatorio: true }).erros.telefone).toBeTruthy()
    expect(validarInscricao({ ...d, telefone: '912345678' }, { telefoneObrigatorio: true }).ok).toBe(true)
  })
})

describe('validarInscricao', () => {
  const base = { nome: 'Ana', email: 'ana@agencia.pt', agencia: 'Casa Azul', ami: '12345', telefone: '', consultores: '', consentimento: true }

  it('exige a licença AMI da agência', () => {
    expect(validarInscricao({ ...base, ami: '' }).erros.ami).toBeTruthy()
  })
  it('aceita a AMI com ou sem o prefixo, e só com 3 a 6 dígitos', () => {
    expect(validarInscricao({ ...base, ami: 'AMI 4719' }).ok).toBe(true)
    expect(validarInscricao({ ...base, ami: 'ami-12345' }).ok).toBe(true)
    expect(validarInscricao({ ...base, ami: '12' }).erros.ami).toBeTruthy()
    expect(validarInscricao({ ...base, ami: '1234567' }).erros.ami).toBeTruthy()
    expect(validarInscricao({ ...base, ami: '12a45' }).erros.ami).toBeTruthy()
  })

  it('aceita uma inscrição completa', () => {
    expect(validarInscricao(base)).toEqual({ ok: true, erros: {} })
  })
  it('exige nome, agência e consentimento', () => {
    const r = validarInscricao({ ...base, nome: ' ', agencia: '', consentimento: false })
    expect(r.ok).toBe(false)
    expect(Object.keys(r.erros).sort()).toEqual(['agencia', 'consentimento', 'nome'])
  })
  it('normaliza a AMI para só os dígitos', () => {
    expect(normalizarAmi(' AMI 04719 ')).toBe('04719')
  })
  it('rejeita email inválido', () => {
    expect(validarInscricao({ ...base, email: 'ana@' }).erros.email).toBeTruthy()
  })
  it('telefone opcional, mas com 9 a 15 dígitos quando existe', () => {
    expect(validarInscricao({ ...base, telefone: '912 345 678' }).ok).toBe(true)
    expect(validarInscricao({ ...base, telefone: '+351 912 345 678' }).ok).toBe(true)
    expect(validarInscricao({ ...base, telefone: '1234' }).erros.telefone).toBeTruthy()
  })
  it('consultores opcional, inteiro a partir de 1', () => {
    expect(validarInscricao({ ...base, consultores: '12' }).ok).toBe(true)
    expect(validarInscricao({ ...base, consultores: '0' }).erros.consultores).toBeTruthy()
    expect(validarInscricao({ ...base, consultores: '2.5' }).erros.consultores).toBeTruthy()
  })
})

describe('tempoAte', () => {
  it('lançamento é 1 de dezembro de 2026 à meia-noite em Lisboa', () => {
    expect(LANCAMENTO.toISOString()).toBe('2026-12-01T00:00:00.000Z')
  })
  it('conta dias, horas, minutos e segundos', () => {
    const agora = new Date('2026-11-29T22:58:30Z')
    expect(tempoAte(LANCAMENTO, agora)).toEqual({ dias: 1, horas: 1, minutos: 1, segundos: 30, terminou: false })
  })
  it('depois do lançamento fica a zero', () => {
    expect(tempoAte(LANCAMENTO, new Date('2026-12-02T00:00:00Z'))).toEqual({ dias: 0, horas: 0, minutos: 0, segundos: 0, terminou: true })
  })
})

describe('codificar', () => {
  it('gera o corpo do Netlify Forms', () => {
    expect(codificar({ 'form-name': 'pre-venda', nome: 'Ana Sá', consentimento: true }))
      .toBe('form-name=pre-venda&nome=Ana%20S%C3%A1&consentimento=true')
  })
})
