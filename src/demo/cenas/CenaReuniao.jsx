import { motion, AnimatePresence } from 'motion/react'
import Revela from '../Revela.jsx'
import { Mesa } from '../ilustracoes/Pessoas.jsx'

/* o que cada um disse por último, para pôr nos balões por cima de cada pessoa */
function ultima(conversa, quem, ate) {
  const ditas = conversa.slice(0, ate).filter(l => l.de === quem)
  return ditas.length ? ditas[ditas.length - 1].texto : null
}

export default function CenaReuniao({ cena, passo }) {
  const ditas = Math.max(0, passo - 1)
  const falaAgora = ditas ? cena.conversa[ditas - 1].de : null
  const balao = (quem, lado) => {
    const t = ultima(cena.conversa, quem, ditas)
    return (
      <div className={`mesa-balao-lugar mesa-balao-lugar--${lado}`}>
        <AnimatePresence mode="popLayout">
          {t && (
            <motion.div
              key={t}
              className={`mesa-balao mesa-balao--${lado} ${falaAgora === quem ? 'mesa-balao--agora' : ''}`}
              initial={{ opacity: 0, y: 14, scale: 0.85 }}
              animate={{ opacity: falaAgora === quem ? 1 : 0.55, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >{t}</motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="cena cena-reuniao">
      <Revela ver={passo >= 1} className="cartao briefing">
        <span className="eyebrow">Briefing preparado pela IA</span>
        <ul>
          {cena.briefing.map((b, i) => (
            <Revela key={b} como="li" ver={passo >= 1} atraso={0.1 + i * 0.12}>{b}</Revela>
          ))}
        </ul>
      </Revela>
      <div className="mesa">
        <div className="mesa-baloes">
          {balao('consultor', 'esq')}
          {balao('lead', 'dir')}
        </div>
        <Revela ver={passo >= 1} de={30}>
          <Mesa
            esquerda={{ nome: 'Rui', cor: '#15181D', cabelo: 'curto' }}
            direita={{ nome: 'Marta', cor: '#E8A13C', cabelo: 'comprido' }}
            quemFala={falaAgora === 'consultor' ? 'esquerda' : falaAgora === 'lead' ? 'direita' : null}
          />
        </Revela>
        <div className="mesa-nomes">
          <span><b>Rui</b> consultor</span>
          <span><b>Marta</b> lead</span>
        </div>
      </div>
    </div>
  )
}
