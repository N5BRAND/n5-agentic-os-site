import { motion, AnimatePresence, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'

/* o polvo: o N5 Imobiliário ao centro e um tentáculo para cada coisa que liga */
const CENTRO = { x: 500, y: 300 }
const NOS = [
  { id: 'ia', x: 160, y: 86, titulo: 'ChatGPT e Claude', curto: 'ChatGPT e Claude', texto: 'Perguntas ao sistema e mexes nos teus negócios a partir do teu assistente, só com as tuas permissões.' },
  { id: 'copiloto', x: 840, y: 86, titulo: 'Copiloto no CRM', curto: 'Copiloto', texto: 'Regista visitas, contactos e notas no CRM da tua rede, sem ninguém escrever à mão.' },
  { id: 'conversas', x: 110, y: 300, titulo: 'WhatsApp, email e agenda', curto: 'WhatsApp', texto: 'As conversas e as visitas entram sozinhas.' },
  { id: 'portais', x: 890, y: 300, titulo: 'Portais e site', curto: 'Portais', texto: 'Cada lead chega e é respondida na hora.' },
  { id: 'comercial', x: 150, y: 532, titulo: 'Comercial', dep: true },
  { id: 'credito', x: 325, y: 574, titulo: 'Crédito', dep: true },
  { id: 'juridico', x: 500, y: 592, titulo: 'Jurídico', dep: true },
  { id: 'financeiro', x: 675, y: 574, titulo: 'Financeiro', dep: true },
  { id: 'broker', x: 850, y: 532, titulo: 'Broker', dep: true },
]
const no = id => NOS.find(n => n.id === id)

const PASSAGENS = [
  { de: 'portais', para: 'comercial', texto: 'Entrou uma lead: contacto, imóvel de interesse e resposta já enviada.' },
  { de: 'comercial', para: 'credito', texto: 'O comprador quer avançar: perfil, valor da proposta e entrada.' },
  { de: 'credito', para: 'juridico', texto: 'Crédito aprovado: valor e data possível da escritura.' },
  { de: 'juridico', para: 'comercial', texto: 'Falta um documento: o pedido segue para o cliente.' },
  { de: 'juridico', para: 'financeiro', texto: 'CPCV assinado: comissão prevista registada.' },
  { de: 'financeiro', para: 'broker', texto: 'Comissões a caminho: de que negócios e quando.' },
]

/* tentáculo ondulado do centro até ao nó */
function tentaculo(n) {
  const dx = n.x - CENTRO.x, dy = n.y - CENTRO.y
  const len = Math.hypot(dx, dy)
  const px = (-dy / len) * 38, py = (dx / len) * 38
  return `M${CENTRO.x} ${CENTRO.y} C ${CENTRO.x + dx * 0.33 + px} ${CENTRO.y + dy * 0.33 + py}, ${CENTRO.x + dx * 0.66 - px} ${CENTRO.y + dy * 0.66 - py}, ${n.x} ${n.y}`
}

export default function Mapa() {
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.35 })
  const [ativa, setAtiva] = useState(0)
  useEffect(() => {
    if (!visivel) return
    const t = setInterval(() => setAtiva(a => (a + 1) % PASSAGENS.length), 3200)
    return () => clearInterval(t)
  }, [visivel])

  const p = PASSAGENS[ativa]
  const de = no(p.de), para = no(p.para)
  const caminho = `M${de.x} ${de.y} Q ${CENTRO.x} ${CENTRO.y} ${para.x} ${para.y}`

  return (
    <section id="sistema" ref={ref} className="seccao escuro mapa">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Como tudo se liga</p>
          <h2>O N5 Imobiliário ao centro. Tudo à volta, ligado.</h2>
          <p>Como um polvo: cada braço liga a uma parte da tua agência. A informação passa de uns para os outros sem ninguém ter de a levar.</p>
        </div>

        <div className="polvo">
          <svg viewBox="0 0 1000 640" className="polvo-svg" aria-hidden="true">
            {NOS.map((n, i) => (
              <g key={n.id}>
                <motion.path
                  d={tentaculo(n)} fill="none" stroke="#E8A13C" strokeWidth="16" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.65, 0, 0.35, 1] }}
                  opacity={n.id === p.de || n.id === p.para ? 1 : 0.55}
                />
                {/* ventosas */}
                <motion.path
                  d={tentaculo(n)} fill="none" stroke="#15181D" strokeWidth="5" strokeLinecap="round" strokeDasharray="0 22"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.7 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + i * 0.05 }}
                />
                <circle r="5" fill="#F5F4F0">
                  <animateMotion dur={`${2.6 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={tentaculo(n)} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
                </circle>
              </g>
            ))}
            {/* a passagem ativa: um pacote vai de um departamento ao outro, passando pelo centro */}
            <g key={ativa}>
              <motion.path
                d={caminho} fill="none" stroke="#F5F4F0" strokeWidth="3" strokeDasharray="6 8"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ duration: 1.1 }}
              />
              <rect x="-12" y="-9" width="24" height="18" rx="4" fill="#F5F4F0" stroke="#15181D" strokeWidth="2.5">
                <animateMotion dur="1.6s" fill="freeze" path={caminho} />
              </rect>
            </g>
          </svg>

          <motion.div
            className="polvo-centro"
            style={{ left: `${(CENTRO.x / 1000) * 100}%`, top: `${(CENTRO.y / 640) * 100}%` }}
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          >
            <Simbolo largura={74} />
            <b>N5 Imobiliário</b>
          </motion.div>

          {NOS.map((n, i) => {
            const aceso = n.id === p.de || n.id === p.para
            return (
              <motion.div
                key={n.id}
                className={`polvo-no ${n.dep ? 'polvo-no--dep' : ''} ${aceso ? 'polvo-no--aceso' : ''}`}
                style={{ left: `${(n.x / 1000) * 100}%`, top: `${(n.y / 640) * 100}%` }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ scale: aceso ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 + i * 0.07 }}
              >
                <b><span className="no-longo">{n.titulo}</span><span className="no-curto">{n.curto || n.titulo}</span></b>
                {n.texto && <span className="no-texto">{n.texto}</span>}
              </motion.div>
            )
          })}
        </div>

        <div className="polvo-legenda" aria-live="polite">
          <span className="eyebrow">O que passa agora</span>
          <AnimatePresence mode="wait">
            <motion.p key={ativa} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <b>{de.titulo} → {para.titulo}.</b> {p.texto}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="polvo-lista">
          {NOS.filter(n => n.texto).map(n => (
            <div key={n.id}><b>{n.titulo}</b><span>{n.texto}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}
