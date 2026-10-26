import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { CENAS } from './dados.js'
import { cenaDe, passoDe } from '../logica/linha-tempo.js'
import CenaLead from './cenas/CenaLead.jsx'
import CenaCoach from './cenas/CenaCoach.jsx'
import CenaReuniao from './cenas/CenaReuniao.jsx'
import CenaOrquestrador from './cenas/CenaOrquestrador.jsx'
import CenaDocumento from './cenas/CenaDocumento.jsx'
import CenaBroker from './cenas/CenaBroker.jsx'
import Rua from './ilustracoes/Rua.jsx'
import Ajusta from '../marca/Ajusta.jsx'

const COMPONENTES = {
  lead: CenaLead,
  coach: CenaCoach,
  reuniao: CenaReuniao,
  orquestrador: CenaOrquestrador,
  documento: CenaDocumento,
  broker: CenaBroker,
}

/* fase do negócio na ficha, uma por cena */
const FASES = ['Lead nova', 'Em seguimento', 'Reunião', 'Proposta aceite', 'CPCV em preparação', 'Escritura prevista']

const VH_POR_CENA = 135

const variantes = {
  entra: dir => ({ opacity: 0, y: dir * 70, scale: 0.97 }),
  centro: { opacity: 1, y: 0, scale: 1 },
  sai: dir => ({ opacity: 0, y: dir * -70, scale: 0.97 }),
}

function Ficha({ indice }) {
  return (
    <motion.div layout className="ficha" transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
      <span className="ficha-rotulo">Ficha do negócio</span>
      <b className="ficha-imovel">T3 em Benfica</b>
      <div className="ficha-fases" aria-hidden="true">
        {FASES.map((f, i) => (
          <span key={f} className={`ficha-fase ${i <= indice ? 'ficha-fase--feita' : ''}`}>
            {i === indice && <motion.i layoutId="ficha-atual" className="ficha-atual" />}
          </span>
        ))}
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={FASES[indice]}
          className="ficha-estado"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >{FASES[indice]}</motion.span>
      </AnimatePresence>
    </motion.div>
  )
}

function Texto({ cena }) {
  return (
    <div className="demo-texto-bloco">
      <p className="eyebrow">{cena.eyebrow}</p>
      <h2>{cena.titulo}</h2>
      <p className="demo-texto-p">{cena.texto}</p>
    </div>
  )
}

/* versão sem movimento: as cenas empilhadas, com tudo à vista */
function DemoEstatica() {
  return (
    <section id="demo" className="demo-estatica seccao">
      <div className="contentor">
        {CENAS.map((c, i) => {
          const C = COMPONENTES[c.id]
          return (
            <div key={c.id} className="demo-estatica-cena">
              <Texto cena={c} />
              <div className="demo-cena-area">
                <Ficha indice={i} />
                <C cena={c} passo={c.passos} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function Demo() {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const barra = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const [estado, setEstado] = useState({ indice: 0, passo: 1, dir: 1 })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const { indice, avanco } = cenaDe(v, CENAS.length)
    const passo = passoDe(avanco, CENAS[indice].passos)
    setEstado(e => (e.indice === indice && e.passo === passo)
      ? e
      : { indice, passo, dir: indice === e.indice ? e.dir : indice > e.indice ? 1 : -1 })
  })

  if (reduzir) return <DemoEstatica />

  const irPara = i => {
    const el = ref.current
    if (!el) return
    const percurso = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + percurso * (i / CENAS.length) + 4, behavior: 'smooth' })
  }

  const cena = CENAS[estado.indice]
  const Cena = COMPONENTES[cena.id]

  return (
    <section id="demo" ref={ref} className="demo" style={{ height: `${CENAS.length * VH_POR_CENA}vh` }}>
      <div className="demo-palco">
        <motion.div className="demo-progresso" style={{ scaleX: barra }} />
        <div className="contentor demo-grelha">
          <div className="demo-lado">
            <ol className="demo-indice" aria-label="Cenas da demonstração">
              {CENAS.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => irPara(i)}
                    className={i === estado.indice ? 'ativo' : i < estado.indice ? 'feito' : ''}
                    aria-current={i === estado.indice ? 'step' : undefined}
                  >
                    {i === estado.indice && <motion.span layoutId="indice-ativo" className="demo-indice-marca" />}
                    <span className="demo-indice-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="demo-indice-nome">{c.curto}</span>
                  </button>
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait" custom={estado.dir} initial={false}>
              <motion.div
                key={cena.id}
                custom={estado.dir}
                variants={variantes}
                initial="entra"
                animate="centro"
                exit="sai"
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                className="demo-texto"
              >
                <Texto cena={cena} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="demo-cena-area">
            <div className="demo-cena-topo">
              <Ficha indice={estado.indice} />
            </div>
            <Ajusta className="demo-cena-ajusta">
              <AnimatePresence mode="wait" custom={estado.dir} initial={false}>
                <motion.div
                  key={cena.id}
                  custom={estado.dir}
                  variants={variantes}
                  initial="entra"
                  animate="centro"
                  exit="sai"
                  transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                  className="demo-cena"
                >
                  <Cena cena={cena} passo={estado.passo} />
                </motion.div>
              </AnimatePresence>
            </Ajusta>
          </div>
        </div>
        <div className="demo-rua">
          <Rua progresso={barra} indice={estado.indice} nomes={CENAS.map(c => c.curto)} />
        </div>
      </div>
    </section>
  )
}
