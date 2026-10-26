import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import Revela from '../Revela.jsx'

/* a mensagem do agente começa com «a escrever» e só depois mostra o texto */
function MensagemAgente({ texto }) {
  const [escrever, setEscrever] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setEscrever(false), 650)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="bolha bolha--agente">
      <span className="bolha-autor">Agente de leads</span>
      <AnimatePresence mode="wait" initial={false}>
        {escrever ? (
          <motion.span key="a" className="a-escrever" exit={{ opacity: 0 }}>
            <i /><i /><i />
          </motion.span>
        ) : (
          <motion.span key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{texto}</motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CenaLead({ cena, passo }) {
  const [m1, m2, m3] = cena.mensagens
  return (
    <div className="cena cena-lead">
      <div className="cartao conversa">
        <Revela ver={passo >= 1} className="conversa-topo">
          <span className="avatar">MS</span>
          <div>
            <b>Marta Silva</b>
            <span className="suave">{cena.origem}</span>
          </div>
          <span className="etiqueta">Lead nova</span>
        </Revela>
        <div className="conversa-corpo">
          <Revela ver={passo >= 1} atraso={0.15} className="bolha bolha--lead">{m1.texto}</Revela>
          <Revela ver={passo >= 2} className="bolha-linha">
            {passo >= 2 && <MensagemAgente texto={m2.texto} />}
          </Revela>
          <Revela ver={passo >= 3} className="bolha bolha--lead">{m3.texto}</Revela>
        </div>
      </div>
      <div className="lead-lado">
        <Revela ver={passo >= 2} atraso={0.7} className="cartao lead-metrica">
          <span className="eyebrow">Primeira resposta</span>
          <span className="numero lead-numero">{cena.tempoResposta}</span>
          <span className="suave">sem o consultor mexer um dedo</span>
        </Revela>
        <Revela ver={passo >= 4} className="cartao lead-qualificacao">
          <span className="eyebrow">Qualificação</span>
          <div className="chips">
            {cena.etiquetas.map((e, i) => (
              <motion.span
                key={e} className="chip"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={passo >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: passo >= 4 ? 0.15 + i * 0.09 : 0 }}
              >{e}</motion.span>
            ))}
          </div>
          <span className="lead-passa">Passada ao Rui Costa · chamada às 18h</span>
        </Revela>
      </div>
    </div>
  )
}
