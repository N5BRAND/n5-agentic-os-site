import { motion } from 'motion/react'

const MOLA = { type: 'spring', stiffness: 90, damping: 16 }
const TINTA = '#15181D'
const CREME = '#F5F4F0'
const DEDOS = 'M160 106 V134 M180 104 V138 M200 104 V138'
const POLEGAR = 'M196 90 C 212 74, 240 76, 252 90'

/* traço com contorno: tinta por baixo, creme por cima */
function Contornado({ d }) {
  return (
    <g strokeLinecap="round" fill="none">
      <path d={d} stroke={TINTA} strokeWidth="24" />
      <path d={d} stroke={CREME} strokeWidth="15" />
    </g>
  )
}

/* dois braços que se aproximam e se cumprimentam; «apertar» abana as mãos e solta as faíscas douradas */
export default function ApertoMao({ ver, apertar, esquerda, direita }) {
  const vem = lado => ({
    initial: { x: lado * 200, opacity: 0 },
    animate: ver ? { x: 0, opacity: 1 } : { x: lado * 200, opacity: 0 },
    transition: MOLA,
  })
  return (
    <div className="aperto">
      <svg viewBox="0 0 420 220" className="aperto-svg" role="img" aria-label={`${esquerda.nome} e ${direita.nome} dão um aperto de mão`}>
        <motion.g
          animate={apertar ? { y: [0, -9, 7, -6, 4, 0] } : { y: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
        >
          <motion.g {...vem(-1)}>
            <g transform="rotate(-14 210 112)">
              <rect x="-60" y="86" width="186" height="52" rx="12" fill={esquerda.cor} />
              <rect x="112" y="78" width="22" height="68" rx="9" fill={CREME} stroke={TINTA} strokeWidth="4.5" />
              <rect x="130" y="88" width="98" height="48" rx="24" fill={CREME} stroke={TINTA} strokeWidth="4.5" />
            </g>
          </motion.g>
          <motion.g {...vem(1)}>
            <g transform="rotate(14 210 112)">
              <rect x="294" y="86" width="186" height="52" rx="12" fill={direita.cor} />
              <rect x="286" y="78" width="22" height="68" rx="9" fill={CREME} stroke={TINTA} strokeWidth="4.5" />
              <rect x="192" y="88" width="98" height="48" rx="24" fill={CREME} stroke={TINTA} strokeWidth="4.5" />
              <Contornado d={DEDOS} />
            </g>
          </motion.g>
          {/* polegar esquerdo por cima da mão direita, só depois de as mãos se encontrarem */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: ver ? 1 : 0 }}
            transition={{ duration: 0.25, delay: ver ? 0.55 : 0 }}
          >
            <g transform="rotate(-14 210 112)"><Contornado d={POLEGAR} /></g>
          </motion.g>
        </motion.g>
        {['M210 50 V28', 'M178 58 L162 40', 'M242 58 L258 40'].map((d, i) => (
          <motion.path
            key={d} d={d} stroke="#E8A13C" strokeWidth="7" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={apertar ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.35, delay: apertar ? 0.5 + i * 0.08 : 0 }}
          />
        ))}
      </svg>
      <div className="aperto-nomes">
        <motion.span animate={{ opacity: ver ? 1 : 0 }}><b>{esquerda.nome}</b> {esquerda.papel}</motion.span>
        <motion.span animate={{ opacity: ver ? 1 : 0 }}><b>{direita.nome}</b> {direita.papel}</motion.span>
      </div>
    </div>
  )
}
