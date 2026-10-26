import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import Revela from '../Revela.jsx'
import ApertoMao from '../ilustracoes/ApertoMao.jsx'

/* número que conta até ao valor quando fica visível */
function Conta({ ate, ver, sufixo = '' }) {
  const v = useMotionValue(0)
  const texto = useTransform(v, n => `${Math.round(n).toLocaleString('pt-PT')}${sufixo}`)
  useEffect(() => {
    const c = animate(v, ver ? ate : 0, { duration: ver ? 1.2 : 0.2, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [ver, ate, v])
  return <motion.span>{texto}</motion.span>
}

export default function CenaBroker({ cena, passo }) {
  const max = cena.funil[0].valor
  const previsao = Number(cena.previsao.replace(/\D/g, ''))
  const final = passo >= 4
  return (
    <div className="cena cena-broker">
      <motion.div
        className="cartao broker"
        animate={final ? { scale: 0.9, opacity: 0.28, filter: 'blur(2px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="broker-cabeca">
          <span className="avatar avatar--dourado">JR</span>
          <div><b>Joana Reis</b><span className="suave">Broker · esta semana</span></div>
        </div>
        <div className="broker-grelha">
          <Revela ver={passo >= 1} className="funil">
            <span className="eyebrow">Funil do mês</span>
            {cena.funil.map((f, i) => (
              <div key={f.fase} className="funil-linha">
                <span>{f.fase}</span>
                <div className="funil-pista">
                  <motion.i
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: passo >= 1 ? f.valor / max : 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18, delay: passo >= 1 ? 0.1 + i * 0.1 : 0 }}
                  />
                </div>
                <span className="numero">{f.valor}</span>
              </div>
            ))}
          </Revela>
          <div className="broker-num">
            <Revela ver={passo >= 2} className="broker-kpi">
              <span className="eyebrow">Faturação prevista</span>
              <span className="numero broker-grande"><Conta ate={previsao} ver={passo >= 2} sufixo=" €" /></span>
            </Revela>
            <Revela ver={passo >= 2} atraso={0.15} className="broker-kpi">
              <span className="eyebrow">Comissões a caminho</span>
              <span className="numero broker-grande"><Conta ate={Number(cena.comissoes)} ver={passo >= 2} /></span>
            </Revela>
          </div>
        </div>
        <Revela ver={passo >= 3} className="broker-alerta">
          <span aria-hidden="true">!</span> {cena.alerta}
        </Revela>
      </motion.div>

      <AnimatePresence>
        {final && (
          <motion.div
            className="broker-final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ApertoMao
              ver
              apertar
              esquerda={{ nome: 'Joana', papel: 'broker', cor: '#E8A13C' }}
              direita={{ nome: 'Rui', papel: 'consultor', cor: '#15181D' }}
            />
            <motion.p
              className="broker-frase"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >Finalmente em sintonia.</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
