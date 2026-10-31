import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'
import { ESGOTADO } from '../logica/pagamento.js'

const AVISOS = [
  { rotulo: 'Agente de leads', texto: 'Lead respondida em 41 s', hora: '23:14' },
  { rotulo: 'Coach de chamadas', texto: 'Próximo passo: propor visita no sábado', hora: '18:07' },
  { rotulo: 'Agenda', texto: 'Reunião marcada · sábado, 11h', hora: '18:09' },
  { rotulo: 'Orquestrador', texto: 'Proposta aceite: crédito, jurídico e financeiro avisados', hora: '12:30' },
  { rotulo: 'Jurídico', texto: 'Documento pedido à lead por WhatsApp', hora: '15:42' },
  { rotulo: 'Financeiro', texto: 'Comissão prevista registada', hora: '16:05' },
]

const subir = (atraso = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 120, damping: 20, delay: atraso },
})

/* pilha de avisos que vai rodando: o sistema a trabalhar sozinho */
function PainelVivo() {
  const [inicio, setInicio] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setInicio(i => (i + 1) % AVISOS.length), 2200)
    return () => clearInterval(t)
  }, [])
  const visiveis = [0, 1, 2].map(k => AVISOS[(inicio + k) % AVISOS.length])

  return (
    <div className="painel-vivo" aria-hidden="true">
      <div className="painel-vivo-cabeca">
        <span className="pulso" /> Agentes a trabalhar
      </div>
      <ul>
        <AnimatePresence initial={false} mode="popLayout">
          {visiveis.map((a, k) => (
            <motion.li
              key={a.texto}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1 - k * 0.12, y: 0, scale: 1 - k * 0.03 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <span className="painel-vivo-rotulo">{a.rotulo}</span>
              <span className="painel-vivo-texto">{a.texto}</span>
              <span className="painel-vivo-hora">{a.hora}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const ySimbolo = useTransform(scrollYProgress, [0, 1], [0, 160])
  const rodar = useTransform(scrollYProgress, [0, 1], [0, -8])

  return (
    <section id="inicio" ref={ref} className="hero escuro">
      <motion.div className="hero-simbolo" style={{ y: ySimbolo, rotate: rodar }} aria-hidden="true">
        <Simbolo fundo="escuro" largura={760} desenhar atraso={0.4} />
      </motion.div>

      <div className="contentor hero-grelha">
        <div className="hero-texto">
          <motion.p className="eyebrow" {...subir(0.1)}>N5 Imobiliário · Lançamento a 1 de dezembro</motion.p>
          <motion.h1 {...subir(0.2)}>O sistema operativo da tua agência imobiliária.</motion.h1>
          <motion.p className="hero-lead" {...subir(0.35)}>
            Do primeiro contacto à comissão paga, num só sítio. Os agentes de IA tratam do trabalho repetitivo. A tua equipa fecha negócios.
          </motion.p>
          <motion.div className="hero-botoes" {...subir(0.5)}>
            <a href="#pre-venda" className="botao">{ESGOTADO ? 'Entrar na lista das próximas licenças' : 'Reservar a licença da agência'}</a>
            <a href="#demo" className="botao botao--linha">Ver como funciona</a>
          </motion.div>
        </div>
        <motion.div {...subir(0.7)}>
          <PainelVivo />
        </motion.div>
      </div>
    </section>
  )
}
