import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { cenaDe } from '../logica/linha-tempo.js'

const EIXOS = [
  { n: '01', titulo: 'Controlar a operação', texto: 'Sabes o que cada consultor fez, quantas leads e visitas há e que negócios estão parados. Sem perguntar.' },
  { n: '02', titulo: 'Ligar os departamentos', texto: 'Comercial, crédito, jurídico e financeiro trabalham na mesma ficha. Ninguém depende do WhatsApp nem da memória.' },
  { n: '03', titulo: 'Saber o dinheiro', texto: 'Que comissões vêm a caminho, de que negócios, quando entram e a quem se pagam.' },
]

/* os três eixos do sistema, um de cada vez: o scroll vai envolvendo cada um em dourado */
export default function Eixos() {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [ativo, setAtivo] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => setAtivo(cenaDe(v, EIXOS.length).indice))

  return (
    <section ref={ref} className="eixos escuro" style={{ height: reduzir ? 'auto' : '280vh' }}>
      <div className={reduzir ? 'eixos-palco eixos-palco--estatico' : 'eixos-palco'}>
        <div className="contentor">
          <p className="eyebrow">O que muda na tua agência</p>
          <div className="eixos-grelha">
            {EIXOS.map((e, i) => {
              const aceso = reduzir || i === ativo
              return (
                <motion.div
                  key={e.n}
                  className={`eixo ${aceso ? 'eixo--ativo' : ''}`}
                  animate={{ opacity: aceso ? 1 : 0.38, y: aceso ? -8 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                >
                  {!reduzir && i === ativo && (
                    <motion.span layoutId="eixo-envolve" className="eixo-envolve" transition={{ type: 'spring', stiffness: 220, damping: 28 }} />
                  )}
                  <span className="eixo-n">{e.n}</span>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </motion.div>
              )
            })}
          </div>
          {!reduzir && (
            <div className="eixos-progresso" aria-hidden="true">
              {EIXOS.map((e, i) => <span key={e.n} className={i <= ativo ? 'cheio' : ''} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
