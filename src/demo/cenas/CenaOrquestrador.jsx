import { motion } from 'motion/react'
import Revela from '../Revela.jsx'

const DESTINOS = ['16.66%', '50%', '83.33%']

export default function CenaOrquestrador({ cena, passo }) {
  return (
    <div className="cena cena-orq">
      <Revela ver={passo >= 1} className="cartao orq-proposta">
        <span className="eyebrow">Proposta aceite</span>
        <span className="numero orq-valor">{cena.proposta}</span>
        <span className="suave">T3 em Benfica · Marta Silva</span>
      </Revela>

      <Revela ver={passo >= 1} atraso={0.2} className="orq-barra">
        <motion.span
          className="orq-anel"
          animate={passo >= 2 ? { scale: [1, 1.35, 1], opacity: [1, 0.5, 1] } : { scale: 1 }}
          transition={{ duration: 1.2, repeat: passo >= 2 ? Infinity : 0 }}
        />
        Orquestrador de passagens
      </Revela>

      <div className="orq-voo" aria-hidden="true">
        {DESTINOS.map((x, i) => (
          <motion.span
            key={x}
            className="orq-pacote"
            initial={{ left: '50%', top: '0%', opacity: 0, scale: 0.4 }}
            animate={passo >= 2
              ? { left: ['50%', x], top: ['0%', '100%'], opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.6] }
              : { left: '50%', top: '0%', opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, delay: passo >= 2 ? i * 0.18 : 0, ease: [0.5, 0, 0.2, 1] }}
          />
        ))}
      </div>

      <div className="orq-departamentos">
        {cena.passagens.map((p, i) => (
          <motion.div
            key={p.para}
            className="cartao orq-dep"
            animate={passo >= 2 ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 10 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20, delay: passo >= 2 ? 0.55 + i * 0.18 : 0 }}
          >
            <h3>{p.para}</h3>
            <Revela ver={passo >= 3} atraso={i * 0.12} className="orq-leva">
              <span className="eyebrow">Recebe</span>
              {p.leva}
            </Revela>
            <Revela ver={passo >= 4} atraso={i * 0.15} className="orq-prepara">
              <span aria-hidden="true">✓</span> {p.prepara}
            </Revela>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
