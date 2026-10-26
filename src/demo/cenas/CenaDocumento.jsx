import { motion } from 'motion/react'
import Revela from '../Revela.jsx'

export default function CenaDocumento({ cena, passo }) {
  const recebido = passo >= 4
  return (
    <div className="cena cena-doc">
      <Revela ver={passo >= 1} className="cartao checklist">
        <div className="checklist-cabeca">
          <span className="eyebrow">Jurídico · Dossier CPCV</span>
          <span className={`etiqueta ${recebido ? '' : 'etiqueta--seguir'}`}>{recebido ? 'Completo' : 'Em curso'}</span>
        </div>
        <ul>
          {cena.checklist.map((c, i) => {
            const ok = c.ok || recebido
            const falta = !c.ok && passo >= 2 && !recebido
            return (
              <motion.li
                key={c.doc}
                className={`check ${ok ? 'check--ok' : ''} ${falta ? 'check--falta' : ''}`}
                initial={{ opacity: 0, x: -14 }}
                animate={passo >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                transition={{ delay: passo >= 1 ? 0.1 + i * 0.14 : 0 }}
              >
                <motion.span
                  className="check-caixa"
                  animate={falta ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6, repeat: falta ? Infinity : 0, repeatDelay: 0.6 }}
                >{ok ? '✓' : falta ? '!' : ''}</motion.span>
                {c.doc}
              </motion.li>
            )
          })}
        </ul>
      </Revela>

      <div className="doc-avisos">
        <Revela ver={passo >= 3} de={-20} className="cartao notificacao">
          <span className="avatar avatar--escuro">RC</span>
          <div>
            <span className="eyebrow">Alerta ao consultor</span>
            <p>{cena.alertaConsultor}</p>
          </div>
        </Revela>
        <Revela ver={passo >= 3} atraso={0.12} className="cartao whatsapp">
          <div className="whatsapp-topo">
            <span className="avatar">MS</span>
            <b>Marta Silva</b>
            <span className="whatsapp-canal">WhatsApp</span>
          </div>
          <div className="whatsapp-corpo">
            <div className="bolha bolha--agente">{cena.whatsapp}</div>
            <Revela ver={passo >= 4} className="bolha bolha--lead bolha--ficheiro">
              <span aria-hidden="true">📎</span> {cena.resposta}
            </Revela>
          </div>
        </Revela>
      </div>
    </div>
  )
}
