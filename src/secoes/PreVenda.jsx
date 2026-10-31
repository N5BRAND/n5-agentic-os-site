import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { LANCAMENTO, tempoAte } from '../logica/contagem.js'
import { validarInscricao, normalizarAmi } from '../logica/validar.js'
import { codificar } from '../logica/netlify.js'
import Prioridades from './Prioridades.jsx'
import PreReserva from './PreReserva.jsx'
import Mensalidade from './Mensalidade.jsx'
import { ESGOTADO } from '../logica/pagamento.js'
import { evento, novoIdEvento } from '../legal/pixel.js'
import { emTeste } from '../legal/teste.js'

const VAZIO = { nome: '', email: '', telefone: '', agencia: '', ami: '', consultores: '', consentimento: false }

/* com as 25 licenças esgotadas, o botão principal guarda a agência para as licenças do trimestre seguinte */
const PRINCIPAL = ESGOTADO ? 'proximo-trimestre' : 'pre-venda'

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
  const [estado, setEstado] = useState('pronto') // pronto | a-enviar | prioridades | pre-reserva | enviado | demonstracao | falhou
  const [pedido, setPedido] = useState(PRINCIPAL) // pre-venda | proximo-trimestre | demonstracao
  const muda = e => {
    const { name, value, type, checked } = e.target
    setD(x => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
  }

  const enviar = async e => {
    e.preventDefault()
    /* o botão de baixo pede uma demonstração ao comercial em vez de seguir para a pré-reserva */
    const tipo = e.nativeEvent.submitter?.value === 'demonstracao' ? 'demonstracao' : PRINCIPAL
    setPedido(tipo)
    const v = validarInscricao(d, { telefoneObrigatorio: tipo === 'demonstracao' })
    setErros(v.erros)
    if (!v.ok) return
    setEstado('a-enviar')
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: codificar({ 'form-name': tipo, ...d, ami: normalizarAmi(d.ami), teste: emTeste() ? '1' : '', 'empresa-site': e.target.elements['empresa-site'].value }),
      })
      if (!r.ok) throw new Error(String(r.status))
      evento('Lead', tipo === 'demonstracao' ? { content_category: 'demonstracao' } : {}, novoIdEvento())
      setEstado(tipo === 'demonstracao' ? 'demonstracao' : 'prioridades')
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
            <h3>{ESGOTADO ? 'Ficas com prioridade.' : 'A tua agência está registada.'}</h3>
            <p>{ESGOTADO ? 'Quando abrirmos as licenças do próximo trimestre, a tua agência é das primeiras a saber. Dá cá cinco 🖐️' : 'Enviamos-te por email o link da pré-reserva assim que estiver ativo. Dá cá cinco 🖐️'}</p>
          </motion.div>
        ) : estado === 'demonstracao' ? (
          <motion.div key="demo" className="prevenda-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.span className="prevenda-ok-icone" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}>✓</motion.span>
            <h3>Pedido recebido.</h3>
            <p>O nosso comercial vai ligar-te para marcar uma demonstração do N5 Imobiliário e ver contigo as opções para a tua agência.</p>
            {!ESGOTADO && <button type="button" className="prioridades-saltar" onClick={() => setEstado('prioridades')}>Prefiro reservar já a licença (pré-reserva de 100 €)</button>}
          </motion.div>
        ) : estado === 'prioridades' ? (
          <Prioridades key="prioridades" email={d.email.trim()} titulo="O que é mais importante para a tua agência?" aoAcabar={() => setEstado(ESGOTADO ? 'enviado' : 'pre-reserva')} />
        ) : estado === 'pre-reserva' ? (
          <PreReserva key="pre-reserva" aoAcabar={() => setEstado('enviado')} />
        ) : (
          <motion.form key="form" name="pre-venda" onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }}>
            <h3>{ESGOTADO ? 'Fica com prioridade nas próximas licenças' : 'Reserva a licença da tua agência'}</h3>
            <p className="prevenda-form-sub">{ESGOTADO ? 'A licença AMI garante que a tua agência fica registada.' : 'Primeiro os dados da agência, com a licença AMI. A seguir, o pagamento da pré-reserva de 100 €.'}</p>
            <p className="so-leitores"><label>Não preenchas: <input name="empresa-site" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="prevenda-campos">
              <Campo nome="nome" rotulo="Nome" value={d.nome} onChange={muda} erro={erros.nome} autoComplete="name" />
              <Campo nome="email" rotulo="Email" type="email" value={d.email} onChange={muda} erro={erros.email} autoComplete="email" />
              <Campo nome="telefone" rotulo="Telefone (obrigatório para a demonstração)" type="tel" value={d.telefone} onChange={muda} erro={erros.telefone} autoComplete="tel" />
              <Campo nome="agencia" rotulo="Agência" value={d.agencia} onChange={muda} erro={erros.agencia} autoComplete="organization" />
              <Campo nome="ami" rotulo="Licença AMI" placeholder="Ex.: 12345" inputMode="numeric" value={d.ami} onChange={muda} erro={erros.ami} />
              <Campo nome="consultores" rotulo="Nº de consultores (opcional)" inputMode="numeric" value={d.consultores} onChange={muda} erro={erros.consultores} />
            </div>
            <label className={`consentimento ${erros.consentimento ? 'campo--erro' : ''}`}>
              <input type="checkbox" name="consentimento" checked={d.consentimento} onChange={muda} />
              <span>Autorizo a Nº 5 a guardar estes dados e a contactar-me sobre {ESGOTADO ? 'as licenças' : 'a pré-venda'} do N5 Imobiliário, nos termos da <a href="/privacidade/" target="_blank" rel="noreferrer">política de privacidade</a>.</span>
            </label>
            {erros.consentimento && <small className="erro-solto">{erros.consentimento}</small>}
            <button className="botao prevenda-botao" type="submit" value={PRINCIPAL} disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' && pedido === PRINCIPAL ? 'A enviar…' : ESGOTADO ? 'Quero prioridade nas próximas licenças' : 'Continuar para o pagamento da pré-reserva'}
            </button>
            <button className="botao botao--linha prevenda-botao prevenda-botao--demo" type="submit" value="demonstracao" disabled={estado === 'a-enviar'}>
              {estado === 'a-enviar' && pedido === 'demonstracao' ? 'A enviar…' : 'Pedir uma demonstração'}
            </button>
            <p className="prevenda-demo-nota">Pedir uma demonstração só regista o pedido: o nosso comercial liga-te para a marcar. Não há pagamento.</p>
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
      <div className="contentor prevenda-grelha prevenda-grelha--coluna">
        <div className="prevenda-texto">
          <p className="eyebrow">{ESGOTADO ? 'Pré-venda esgotada' : 'Pré-venda'}</p>
          <h2>1 de dezembro. O sistema completo, de uma vez.</h2>
          <Contagem />
          {ESGOTADO ? (
            <p className="prevenda-lead">
              Comercial, consultor, crédito, jurídico, financeiro e broker: tudo lançado no mesmo dia.
              As 25 licenças da pré-venda, com 50% de desconto na primeira mensalidade, já esgotaram. Abrimos novas licenças
              a cada trimestre, conforme a equipa consegue acompanhar mais agências: deixa o contacto e a tua agência fica com prioridade nas próximas.
            </p>
          ) : (
          <p className="prevenda-lead">
            Comercial, consultor, crédito, jurídico, financeiro e broker: tudo lançado no mesmo dia.
            A pré-venda está aberta: 50% de desconto na primeira mensalidade numa das 25 licenças
            reservadas e um pacote de 12 formações anuais sobre o sistema, para toda a equipa tirar partido dele.
            Garantes a licença da tua agência com uma pré-reserva de 100 €. Preferes ver primeiro? Pede uma demonstração.
          </p>
          )}
          <div className={`prevenda-oferta ${ESGOTADO ? 'prevenda-oferta--duas' : ''}`}>
            <motion.div
              className="prevenda-oferta-num"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span>25</span>
              <small>{ESGOTADO ? 'licenças da pré-venda, já esgotadas' : 'licenças reservadas'}</small>
            </motion.div>
            <motion.div
              className="prevenda-oferta-num prevenda-oferta-num--destaque"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <span>{ESGOTADO ? '1:1' : '50%'}</span>
              <small>{ESGOTADO ? 'demonstração com a nossa equipa, quando quiseres' : 'de desconto na primeira mensalidade'}</small>
            </motion.div>
            {!ESGOTADO && <motion.div
              className="prevenda-oferta-num prevenda-oferta-num--formacao"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span>12</span>
              <small>formações por ano sobre o sistema, incluídas</small>
            </motion.div>}
          </div>
          <p className="prevenda-porque"><b>Porquê só 25 licenças?</b> Nas primeiras 25 agências, a configuração é feita diretamente pela nossa equipa, com acompanhamento e formação. Para garantir essa qualidade, a pré-venda fica limitada a 25 licenças. Depois do lançamento, abrimos novas licenças a cada trimestre, conforme a equipa consegue acompanhar mais agências.</p>
          {!ESGOTADO && <motion.div
            className="prevenda-reserva prevenda-reserva--explicada"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            <p className="prevenda-reserva-titulo">Todas as agências que fizerem a pré-reserva de 100 € têm <b>50% de desconto na primeira mensalidade</b>: 149,50 € em vez de 299 €. Com os 100 € descontados, pagas 49,50 € no 1.º mês e 299 € a partir do 2.º.</p>
            <div className="prevenda-reserva-linha">
            <div className="prevenda-reserva-valor">
              <small>Pré-reserva</small>
              <span>100 €</span>
              <Mensalidade />
            </div>
            <ul className="prevenda-reserva-condicoes">
              <li>50% de desconto na primeira mensalidade</li>
              <li>Os 100 € são descontados na primeira mensalidade</li>
              <li>Reembolsável após o dia do lançamento</li>
            </ul>
            </div>
          </motion.div>}
          <Formulario />
        </div>
      </div>
    </section>
  )
}
