import { motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const TINTA = '#15181D'
const CREME = '#F5F4F0'
const DOURADO = '#E8A13C'
const TRACO = { stroke: TINTA, strokeWidth: 3, strokeLinejoin: 'round' }

/* o mundo tem 3600 unidades e 6 paragens de 600 em 600; a câmara anda 3600 unidades ao longo do scroll,
   por isso cada paragem passa ao centro do ecrã a meio da sua cena */
const MUNDO = 3600
const CHAO = 128
const paragem = i => 300 + i * 600

function Janelas({ x, y, colunas, linhas, w = 12, h = 14, gx = 20, gy = 22, acesa }) {
  const r = []
  for (let c = 0; c < colunas; c++) for (let l = 0; l < linhas; l++) {
    r.push(<rect key={`${c}-${l}`} x={x + c * gx} y={y + l * gy} width={w} height={h} rx="2" fill={(c + l) % 3 === acesa ? DOURADO : CREME} {...TRACO} strokeWidth="2" />)
  }
  return r
}

function Arvore({ x }) {
  return (
    <g>
      <rect x={x - 3} y={CHAO - 26} width="6" height="26" fill={TINTA} />
      <circle cx={x} cy={CHAO - 36} r="16" fill="#E9E6DD" {...TRACO} />
    </g>
  )
}

function Candeeiro({ x }) {
  return (
    <g>
      <rect x={x - 2} y={CHAO - 70} width="4" height="70" fill={TINTA} />
      <path d={`M${x} ${CHAO - 70} q 0 -8 14 -8`} stroke={TINTA} strokeWidth="4" fill="none" />
      <rect x={x + 10} y={CHAO - 80} width="12" height="7" rx="3" fill={DOURADO} {...TRACO} strokeWidth="2" />
    </g>
  )
}

/* os edifícios de cada paragem */
const MARCOS = [
  /* 1 · lead nova: um telemóvel gigante com uma mensagem */
  x => (
    <g>
      <rect x={x - 26} y={CHAO - 96} width="52" height="96" rx="10" fill={TINTA} />
      <rect x={x - 20} y={CHAO - 86} width="40" height="70" rx="5" fill={CREME} />
      <rect x={x - 15} y={CHAO - 78} width="24" height="10" rx="5" fill="#E2DED4" />
      <rect x={x - 9} y={CHAO - 62} width="24" height="10" rx="5" fill={DOURADO} />
      <rect x={x - 15} y={CHAO - 46} width="18" height="10" rx="5" fill="#E2DED4" />
    </g>
  ),
  /* 2 · chamada: escritório com auscultadores na janela */
  x => (
    <g>
      <rect x={x - 46} y={CHAO - 92} width="92" height="92" fill="#EDEAE2" {...TRACO} />
      <Janelas x={x - 34} y={CHAO - 80} colunas={4} linhas={2} acesa={1} />
      <rect x={x - 12} y={CHAO - 30} width="24" height="30" fill={TINTA} />
      <path d={`M${x - 18} ${CHAO - 104} q 18 -22 36 0`} stroke={TINTA} strokeWidth="5" fill="none" />
      <rect x={x - 24} y={CHAO - 108} width="10" height="14" rx="4" fill={DOURADO} {...TRACO} strokeWidth="2" />
      <rect x={x + 14} y={CHAO - 108} width="10" height="14" rx="4" fill={DOURADO} {...TRACO} strokeWidth="2" />
    </g>
  ),
  /* 3 · reunião: café com toldo */
  x => (
    <g>
      <rect x={x - 50} y={CHAO - 78} width="100" height="78" fill="#EDEAE2" {...TRACO} />
      <path d={`M${x - 56} ${CHAO - 78} h112 l-8 18 h-96 Z`} fill={DOURADO} {...TRACO} />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${x - 42 + i * 26} ${CHAO - 60} q 13 10 26 0`} fill="none" stroke={TINTA} strokeWidth="2" />)}
      <rect x={x - 38} y={CHAO - 46} width="40" height="28" fill={CREME} {...TRACO} strokeWidth="2" />
      <rect x={x + 14} y={CHAO - 40} width="22" height="40" fill={TINTA} />
      <text x={x} y={CHAO - 84} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="12" fill={TINTA}>CAFÉ</text>
    </g>
  ),
  /* 4 · proposta: a agência, com o símbolo */
  x => (
    <g>
      <rect x={x - 44} y={CHAO - 120} width="88" height="120" fill={TINTA} />
      <Janelas x={x - 32} y={CHAO - 104} colunas={4} linhas={3} acesa={2} />
      <rect x={x - 14} y={CHAO - 34} width="28" height="34" fill={DOURADO} />
      <g transform={`translate(${x - 21} ${CHAO - 140}) scale(0.2)`}>
        <g strokeWidth="16" strokeLinecap="round" fill="none">
          <path stroke={TINTA} d="M25 8 V102 M75 8 V102 M125 8 V102 M175 8 V102" />
          <path stroke={DOURADO} d="M4 88 L200 20" />
        </g>
      </g>
    </g>
  ),
  /* 5 · documentos: cartório com colunas */
  x => (
    <g>
      <path d={`M${x - 52} ${CHAO - 86} L${x} ${CHAO - 110} L${x + 52} ${CHAO - 86} Z`} fill="#EDEAE2" {...TRACO} />
      <rect x={x - 48} y={CHAO - 86} width="96" height="10" fill={TINTA} />
      {[0, 1, 2, 3].map(i => <rect key={i} x={x - 40 + i * 24} y={CHAO - 76} width="10" height="66" fill={CREME} {...TRACO} strokeWidth="2" />)}
      <rect x={x - 54} y={CHAO - 10} width="108" height="10" fill={TINTA} />
    </g>
  ),
  /* 6 · escritura: a torre do broker com bandeira */
  x => (
    <g>
      <rect x={x - 32} y={CHAO - 140} width="64" height="140" fill="#EDEAE2" {...TRACO} />
      <Janelas x={x - 22} y={CHAO - 128} colunas={3} linhas={5} acesa={0} />
      <rect x={x - 1.5} y={CHAO - 176} width="3" height="36" fill={TINTA} />
      <motion.path
        d={`M${x + 1} ${CHAO - 176} h26 l-6 8 l6 8 h-26 Z`} fill={DOURADO} {...TRACO} strokeWidth="2"
        animate={{ skewY: [0, 4, 0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
      />
    </g>
  ),
]

/* árvores e candeeiros entre paragens, e para lá das pontas para o ecrã nunca ficar vazio */
const ENCHIMENTO = Array.from({ length: 34 }, (_, i) => {
  const x = -1500 + i * 200 + 60
  const perto = [0, 1, 2, 3, 4, 5].some(k => Math.abs(x - paragem(k)) < 110 || Math.abs(x - (paragem(k) + 112)) < 70)
  return perto ? null : { t: i % 2 ? 'candeeiro' : 'arvore', x }
}).filter(Boolean)

/* quem caminha: tu, a seguir o negócio */
function Caminhante({ progresso }) {
  const perna = useTransform(progresso, v => Math.sin(v * 260) * 26)
  const outra = useTransform(perna, v => -v)
  const balanco = useTransform(progresso, v => Math.abs(Math.sin(v * 260)) * -3)
  return (
    <motion.svg viewBox="0 0 40 70" className="rua-caminhante" style={{ y: balanco }} aria-hidden="true">
      <motion.line x1="20" y1="44" x2="20" y2="66" stroke={TINTA} strokeWidth="6" strokeLinecap="round" style={{ rotate: perna, originX: '20px', originY: '44px' }} />
      <motion.line x1="20" y1="44" x2="20" y2="66" stroke={TINTA} strokeWidth="6" strokeLinecap="round" style={{ rotate: outra, originX: '20px', originY: '44px' }} />
      <rect x="9" y="22" width="22" height="26" rx="9" fill={DOURADO} stroke={TINTA} strokeWidth="3" />
      <circle cx="20" cy="12" r="9" fill={CREME} stroke={TINTA} strokeWidth="3" />
    </motion.svg>
  )
}

export default function Rua({ progresso, indice, nomes }) {
  const ref = useRef(null)
  const largura = useMotionValue(1200)
  const escala = useMotionValue(1)
  const [altura, setAltura] = useState(150)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => {
      largura.set(el.clientWidth)
      escala.set(el.clientHeight / 160)
      setAltura(el.clientHeight)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [largura, escala])
  /* a câmara: o ponto do mundo em MUNDO × progresso fica ao centro da faixa */
  const x = useTransform([progresso, largura, escala], ([p, l, s]) => l / 2 - MUNDO * p * s)

  return (
    <div className="rua" ref={ref} aria-hidden="true">
      <motion.svg
        className="rua-mundo"
        viewBox={`0 0 ${MUNDO} 160`}
        width={(MUNDO * altura) / 160}
        height={altura}
        style={{ x }}
      >
        <rect x="-3000" y={CHAO} width={MUNDO + 6000} height="32" fill={TINTA} />
        <line x1="-3000" y1={CHAO + 16} x2={MUNDO + 3000} y2={CHAO + 16} stroke={CREME} strokeWidth="2.5" strokeDasharray="18 16" opacity="0.6" />
        {ENCHIMENTO.map(e => e.t === 'arvore' ? <Arvore key={e.x} x={e.x} /> : <Candeeiro key={e.x} x={e.x} />)}
        {MARCOS.map((m, i) => (
          <g key={i} opacity={i <= indice ? 1 : 0.45}>
            {m(paragem(i))}
          </g>
        ))}
        {nomes.map((n, i) => (
          <g key={n} transform={`translate(${paragem(i) + 112} ${CHAO - 44})`}>
            <rect x="-2" y="0" width="4" height="44" fill={TINTA} />
            <rect x="-50" y="-24" width="100" height="22" rx="6" fill={i === indice ? DOURADO : CREME} stroke={TINTA} strokeWidth="2.5" />
            <text x="0" y="-9" textAnchor="middle" fontFamily="Courier New, monospace" fontWeight="700" fontSize="10.5" fill={TINTA}>
              {String(i + 1).padStart(2, '0')} {n.toUpperCase()}
            </text>
          </g>
        ))}
      </motion.svg>
      <Caminhante progresso={progresso} />
    </div>
  )
}
