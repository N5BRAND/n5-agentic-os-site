import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import { validarInscricao } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'

const NO_LANCAMENTO = ['Resposta automática a leads', 'Coach de chamadas', 'Resumo semanal ao broker']
const A_SEGUIR = ['Crédito', 'Jurídico', 'Financeiro', 'Comunicação entre departamentos', 'Relatório ao proprietário', 'Cruzamento de compradores e imóveis', 'Ecrã do investidor']

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', consultores: '', consentimento: false }

function Contagem() {
  const [t, setT] = useState(() => tempoAte(LANCAMENTO))
  useEffect(() => {
    const i = setInterval(() => setT(tempoAte(LANCAMENTO)), 1000)
    return () => clearInterval(i)
  }, [])
  const partes = [['dias', t.dias], ['horas', t.horas], ['min', t.minutos], ['seg', t.segundos]]
  return (
    <div className="contagem" aria-label={`Faltam ${t.dias} dias para o lançamento`}>
      {partes.map(([r, v]) => (
        <div key={r} className="contagem-parte">
          <span className="contagem-num">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} initial={{ y: '-60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '60%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {String(v).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="contagem-rotulo">{r}</span>
        </div>
      ))}
    </div>
  )
}

function Campo({ nome, rotulo, erro, ...resto }) {
  return (
    <label className={`campo ${erro ? 'campo--erro' : ''}`}>
      <span>{rotulo}</span>
      <input name={nome} aria-invalid={!!erro} {...resto} />
      <AnimatePresence>
        {erro && <motion.small initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{erro}</motion.small>}
      </AnimatePresence>
    </label>
  )
}

function Formulario() {
  const [d, setD] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | enviado | falhou
  const muda = e => {
    const { name, value, type, checked } = e.target
    setD(x => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
  }

  const enviar = async e => {
    e.preventDefault()
    const v = validarInscricao(d)
    setErros(v.erros)
    if (!v.ok) return
    setEstado('a-enviar')
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': 'pre-venda', ...d, 'empresa-site': e.target.elements['empresa-site'].value }),
      })
      if (!r.ok) throw new Error(String(r.status))
      setEstado('enviado')
    } catch {
      setEstado('falhou')
    }
  }

  return (
    <div className="cartao prevenda-form">
      <AnimatePresence mode="wait">
        {estado === 'enviado' ? (
          <motion.div key="ok" className="prevenda-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.span className="prevenda-ok-icone" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}>✓</motion.span>
            <h3>Estás na lista.</h3>
            <p>Quando a pré-venda abrir, és dos primeiros a saber. Dá cá cinco 🖐️</p>
          </motion.div>
        ) : (
          <motion.form key="form" name="pre-venda" onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }}>
            <h3>Entra na lista de espera</h3>
            <p className="prevenda-form-sub">Sem compromisso. Avisamos-te quando a pré-venda abrir.</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="prevenda-campos">
              <Campo nome="nome" rotulo="Nome" value={d.nome} onChange={muda} erro={erros.nome} autoComplete="name" />
              <Campo nome="email" rotulo="Email" type="email" value={d.email} onChange={muda} erro={erros.email} autoComplete="email" />
              <Campo nome="telefone" rotulo="Telefone (opcional)" type="tel" value={d.telefone} onChange={muda} erro={erros.telefone} autoComplete="tel" />
              <Campo nome="agencia" rotulo="Agência" value={d.agencia} onChange={muda} erro={erros.agencia} autoComplete="organization" />
              <Campo nome="consultores" rotulo="Nº de consultores (opcional)" inputMode="numeric" value={d.consultores} onChange={muda} erro={erros.consultores} />
            </div>
            <label className={`consentimento ${erros.consentimento ? 'campo--erro' : ''}`}>
              <input type="checkbox" name="consentimento" checked={d.consentimento} onChange={muda} />
              <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre a pré-venda do Agentic OS.</span>
            </label>
            {erros.consentimento && <small className="erro-solto">{erros.consentimento}</small>}
            <button className="botao prevenda-botao" type="submit" disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' ? 'A enviar…' : 'Quero entrar na pré-venda'}
            </button>
            {estado === 'falhou' && <p className="erro-solto">Não conseguimos enviar. Tenta outra vez daqui a pouco.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PreVenda() {
  return (
    <section id="pre-venda" className="seccao escuro prevenda">
      <div className="contentor prevenda-grelha">
        <div className="prevenda-texto">
          <p className="eyebrow">Pré-venda</p>
          <h2>Lançamento a 1 de dezembro. Entra antes.</h2>
          <p className="prevenda-lead">
            Antes do lançamento abrimos uma pré-venda só para quem está na lista de espera.
            Os primeiros pacotes têm <b className="prevenda-desconto">até 50% de desconto</b>.
          </p>
          <Contagem />
          <div className="prevenda-modulos">
            <div>
              <span className="etiqueta">1 de dezembro</span>
              <ul>{NO_LANCAMENTO.map(m => <li key={m}>{m}</li>)}</ul>
            </div>
            <div>
              <span className="etiqueta etiqueta--seguir">A seguir</span>
              <ul>{A_SEGUIR.map(m => <li key={m}>{m}</li>)}</ul>
            </div>
          </div>
        </div>
        <Formulario />
      </div>
    </section>
  )
}
