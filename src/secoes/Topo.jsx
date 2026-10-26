import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'

export default function Topo() {
  const { scrollY } = useScroll()
  const [solido, setSolido] = useState(false)
  useMotionValueEvent(scrollY, 'change', y => setSolido(y > 40))

  return (
    <motion.header
      className={`topo ${solido ? 'topo--solido' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.2 }}
    >
      <div className="contentor topo-linha">
        <a href="#inicio" className="topo-marca" aria-label="N5 Imobiliário, início">
          <Simbolo fundo={solido ? 'claro' : 'escuro'} largura={44} />
          <span>N5 Imobiliário</span>
        </a>
        <nav className="topo-nav" aria-label="Secções">
          <a href="#demo">Como funciona</a>
          <a href="#sistema">O sistema</a>
          <a href="#pre-venda">Pré-venda</a>
        </nav>
        <a href="#pre-venda" className="botao topo-cta">Lista de espera</a>
      </div>
    </motion.header>
  )
}
