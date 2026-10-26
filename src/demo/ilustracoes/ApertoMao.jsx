import { motion } from 'motion/react'

const MOLA = { type: 'spring', stiffness: 90, damping: 16 }
const TINTA = '#15181D'
const CREME = '#F5F4F0'

/* dois braços que se aproximam e se cumprimentam; «apertar» abana as mãos e solta as faíscas douradas */
export default function ApertoMao({ ver, apertar, esquerda, direita }) {
  return (
    <div className="aperto">
      <svg viewBox="0 0 420 200" className="aperto-svg" role="img" aria-label={`${esquerda.nome} e ${direita.nome} dão um aperto de mão`}>
        <motion.g
          animate={apertar ? { y: [0, -9, 7, -6, 4, 0] } : { y: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
        >
          {/* braço esquerdo */}
          <motion.g initial={{ x: -190, opacity: 0 }} animate={ver ? { x: 0, opacity: 1 } : { x: -190, opacity: 0 }} transition={MOLA}>
            <rect x="-20" y="92" width="150" height="56" rx="12" fill={esquerda.cor} />
            <rect x="120" y="86" width="18" height="68" rx="7" fill={CREME} stroke={TINTA} strokeWidth="3.5" />
            <rect x="134" y="96" width="86" height="46" rx="23" fill={CREME} stroke={TINTA} strokeWidth="4" />
          </motion.g>
          {/* braço direito, por cima */}
          <motion.g initial={{ x: 190, opacity: 0 }} animate={ver ? { x: 0, opacity: 1 } : { x: 190, opacity: 0 }} transition={MOLA}>
            <rect x="290" y="92" width="150" height="56" rx="12" fill={direita.cor} />
            <rect x="282" y="86" width="18" height="68" rx="7" fill={CREME} stroke={TINTA} strokeWidth="3.5" />
            <rect x="192" y="100" width="96" height="44" rx="22" fill={CREME} stroke={TINTA} strokeWidth="4" />
            <path d="M214 106 V136 M230 104 V138 M246 104 V138" stroke={TINTA} strokeWidth="3.5" strokeLinecap="round" />
          </motion.g>
          {/* polegar esquerdo por cima da mão direita */}
          <motion.path
            d="M176 100 C 190 82, 222 82, 236 100"
            fill="none" stroke={TINTA} strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={ver ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: ver ? 0.55 : 0 }}
          />
        </motion.g>
        {/* faíscas */}
        {['M210 62 V40', 'M182 70 L166 52', 'M238 70 L254 52'].map((d, i) => (
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
