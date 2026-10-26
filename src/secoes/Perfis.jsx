import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { cenaDe } from '../logica/linha-tempo.js'
import Ajusta from '../marca/Ajusta.jsx'

/* três percursos que se juntam no jurídico, na escritura e na comissão (coordenadas num quadro de 1200 × 560) */
const JUNCAO = { x: 800, y: 280 }
const FAIXAS = [
  { id: 'comprador', nome: 'Comprador', y: 120, d: 'M40 120 C 420 120, 600 120, 800 280', passos: ['Lead', 'Visitas', 'Proposta'] },
  { id: 'vendedor', nome: 'Vendedor', y: 280, d: 'M40 280 H 800', passos: ['Lead', 'Avaliação', 'Angariação'] },
  { id: 'investidor', nome: 'Investidor', y: 440, d: 'M40 440 C 420 440, 600 440, 800 280', passos: ['Lead', 'SPVs', 'Subscrição'] },
]
const FINAL = 'M800 280 H 1160'
const MARCOS_FINAIS = [{ x: 890, nome: 'CPCV · AML' }, { x: 1010, nome: 'Escritura' }, { x: 1130, nome: 'Comissão' }]

const FASES = [
  { eyebrow: '01 · Três percursos', titulo: 'Cada cliente segue o seu caminho.', texto: 'Comprador, vendedor e investidor: o sistema acompanha os três ao mesmo tempo, passo a passo.' },
  { eyebrow: '02 · Matching automático', titulo: 'Quem compra encontra quem vende. Quem investe encontra a oportunidade.', texto: 'Entrou um imóvel? O sistema encontra os compradores certos na tua carteira, e o contrário. E mostra as oportunidades de investimento aos investidores que já são teus contactos.' },
  { eyebrow: '03 · Entraves detetados', titulo: 'Avisa antes de o negócio cair.', texto: 'O sistema deteta o que está a travar cada processo e diz-te logo o passo seguinte.' },
  { eyebrow: '04 · CPCV, documentos e AML', titulo: 'Os três juntam-se no jurídico.', texto: 'Documentos, CPCV e verificação AML tratados antes da escritura, sem correrias.' },
  { eyebrow: '05 · Escritura e comissão', titulo: 'Escritura feita. Comissão recebida.', texto: 'E paga a quem é devida, com as partilhas certas entre agência e consultores.' },
]

const pct = (x, y) => ({ left: `${(x / 1200) * 100}%`, top: `${(y / 560) * 100}%` })
const MOLA = { type: 'spring', stiffness: 220, damping: 22 }

function Cartao({ ver, onde, tipo, rotulo, children, atraso = 0 }) {
  return (
    <AnimatePresence>
      {ver && (
        <motion.div
          className={`perfis-cartao perfis-cartao--${tipo}`}
          style={onde}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ ...MOLA, delay: atraso }}
        >
          <span className="perfis-cartao-rotulo">{rotulo}</span>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* a mesma história em vertical, para o telemóvel: três faixas que descem e se juntam (quadro de 360 × 330) */
const V_FAIXAS = [
  { id: 'comprador', nome: 'Comprador', x: 60, d: 'M60 34 V150 C 60 195, 180 190, 180 230', passos: ['Lead', 'Visitas', 'Proposta'] },
  { id: 'vendedor', nome: 'Vendedor', x: 180, d: 'M180 34 V230', passos: ['Lead', 'Avaliação', 'Angariação'] },
  { id: 'investidor', nome: 'Investidor', x: 300, d: 'M300 34 V150 C 300 195, 180 190, 180 230', passos: ['Lead', 'SPVs', 'Subscrição'] },
]
const V_FINAL = 'M180 230 V320'

function MapaVertical({ f, linha, linhaFim }) {
  const arco = (d, cor, atraso) => (
    <motion.path
      d={d} fill="none" stroke={cor} strokeWidth="3" strokeDasharray="6 6"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={f >= 1 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.8, delay: f >= 1 ? atraso : 0 }}
    />
  )
  return (
    <svg viewBox="0 0 360 330" className="perfis-svg perfis-svg--v" aria-hidden="true">
      {V_FAIXAS.map(fx => (
        <g key={fx.id}>
          <path d={fx.d} fill="none" stroke="rgba(21,24,29,0.08)" strokeWidth="12" strokeLinecap="round" />
          <motion.path d={fx.d} fill="none" stroke="#15181D" strokeWidth="4" strokeLinecap="round" style={{ pathLength: linha }} />
          <text x={fx.x} y="18" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="Bricolage Grotesque, sans-serif" fill="#15181D">{fx.nome}</text>
          {fx.passos.map((p, i) => (
            <g key={p}>
              <circle cx={fx.x} cy={56 + i * 38} r="7" fill="#F5F4F0" stroke="#15181D" strokeWidth="3" />
              <text x={fx.x + 12} y={60 + i * 38} fontSize="11" fontFamily="Archivo, sans-serif" fill="#15181D">{p}</text>
            </g>
          ))}
        </g>
      ))}
      {arco('M66 170 Q 122 146 178 172', '#2B44E7', 0)}
      {arco('M182 172 Q 238 146 294 170', '#B4761A', 0.5)}
      <path d={V_FINAL} fill="none" stroke="rgba(21,24,29,0.08)" strokeWidth="12" strokeLinecap="round" />
      <motion.path d={V_FINAL} fill="none" stroke="#E8A13C" strokeWidth="7" strokeLinecap="round" style={{ pathLength: linhaFim }} />
      <circle cx="180" cy="230" r="6" fill="#15181D" />
      {MARCOS_FINAIS.map((m, i) => {
        const aceso = f >= 3 + (i > 0 ? 1 : 0)
        return (
          <g key={m.nome}>
            <circle cx="180" cy={256 + i * 30} r="10" fill={aceso ? '#E8A13C' : '#F5F4F0'} stroke="#15181D" strokeWidth="3" />
            <text x="198" y={260 + i * 30} fontSize="12" fontWeight="700" fontFamily="Archivo, sans-serif" fill="#15181D">{m.nome}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Perfis() {
  const reduzir = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [fase, setFase] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => setFase(cenaDe(v, FASES.length).indice))
  const desenho = useTransform(scrollYProgress, [0, 0.18], [0, 1])
  const fim = useTransform(scrollYProgress, [0.58, 0.95], [0, 1])
  const f = reduzir ? FASES.length - 1 : fase
  const linha = reduzir ? 1 : desenho
  const linhaFim = reduzir ? 1 : fim

  return (
    <section ref={ref} className="perfis" style={{ height: reduzir ? 'auto' : '420vh' }}>
      <div className={reduzir ? 'perfis-palco perfis-palco--estatico' : 'perfis-palco'}>
        <Ajusta>
        <div className="contentor perfis-grelha">
          <div className="perfis-texto">
            <p className="eyebrow">Três perfis, um destino</p>
            <AnimatePresence mode="wait">
              <motion.div key={f} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={MOLA}>
                <span className="perfis-fase">{FASES[f].eyebrow}</span>
                <h2>{FASES[f].titulo}</h2>
                <p>{FASES[f].texto}</p>
              </motion.div>
            </AnimatePresence>
            <div className="perfis-pontos" aria-hidden="true">
              {FASES.map((x, i) => <span key={i} className={i <= f ? 'cheio' : ''} />)}
            </div>
          </div>

          <div className="perfis-mapa">
            <MapaVertical f={f} linha={linha} linhaFim={linhaFim} />
            <svg viewBox="0 0 1200 560" className="perfis-svg perfis-svg--h" aria-hidden="true">
              {FAIXAS.map(fx => (
                <g key={fx.id}>
                  <path d={fx.d} fill="none" stroke="rgba(21,24,29,0.08)" strokeWidth="18" strokeLinecap="round" />
                  <motion.path d={fx.d} fill="none" stroke="#15181D" strokeWidth="6" strokeLinecap="round" style={{ pathLength: linha }} />
                </g>
              ))}
              <path d={FINAL} fill="none" stroke="rgba(21,24,29,0.08)" strokeWidth="18" strokeLinecap="round" />
              <motion.path d={FINAL} fill="none" stroke="#E8A13C" strokeWidth="10" strokeLinecap="round" style={{ pathLength: linhaFim }} />

              {/* matching: um arco entre comprador e vendedor */}
              <motion.path
                d="M470 130 C 540 170, 540 230, 470 270"
                fill="none" stroke="#2B44E7" strokeWidth="4" strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={f >= 1 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
              {/* oportunidade de investimento: um arco entre o imóvel angariado e os investidores da carteira */}
              <motion.path
                d="M470 290 C 540 330, 540 390, 470 430"
                fill="none" stroke="#B4761A" strokeWidth="4" strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={f >= 1 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: f >= 1 ? 0.5 : 0 }}
              />

              {FAIXAS.map(fx => fx.passos.map((p, i) => (
                <g key={fx.id + p}>
                  <circle cx={110 + i * 150} cy={fx.y} r="11" fill="#F5F4F0" stroke="#15181D" strokeWidth="4" />
                  <text x={110 + i * 150} y={fx.y + 36} textAnchor="middle" fontSize="17" fontFamily="Archivo, sans-serif" fill="#15181D">{p}</text>
                </g>
              )))}
              {FAIXAS.map(fx => (
                <text key={fx.id} x="40" y={fx.y - 26} fontSize="20" fontWeight="800" fontFamily="Bricolage Grotesque, sans-serif" fill="#15181D">{fx.nome}</text>
              ))}
              {MARCOS_FINAIS.map((m, i) => (
                <g key={m.nome}>
                  <motion.circle
                    cx={m.x} cy="280" r="20"
                    fill={f >= 3 + (i > 0 ? 1 : 0) ? '#E8A13C' : '#F5F4F0'} stroke="#15181D" strokeWidth="4"
                    animate={f === 3 + (i > 0 ? 1 : 0) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <text x={m.x} y="330" textAnchor="middle" fontSize="17" fontWeight="700" fontFamily="Archivo, sans-serif" fill="#15181D">{m.nome}</text>
                </g>
              ))}
              <circle cx={JUNCAO.x} cy={JUNCAO.y} r="9" fill="#15181D" />
            </svg>

            <Cartao ver={f === 1} onde={pct(1010, 130)} tipo="match" rotulo="Match encontrado">
              <b>T3 em Benfica encaixa em 3 compradores</b>
              <span className="perfis-chips"><i>Zona</i><i>Tipologia</i><i>Preço</i><i>Crédito</i></span>
            </Cartao>
            <Cartao ver={f === 1} onde={pct(1010, 490)} tipo="investe" rotulo="Oportunidade de investimento" atraso={0.5}>
              <b>Moradia para reabilitar em Almada: 2 investidores da tua carteira encaixam</b>
              <span className="perfis-chips"><i>Rentabilidade</i><i>Capital disponível</i><i>Zona</i></span>
            </Cartao>
            <Cartao ver={f === 2} onde={pct(1010, 110)} tipo="alerta" rotulo="Entrave no comprador">
              <b>Avaliação do banco 8 000 € abaixo do preço</b>
              <span className="perfis-sugestao">Sugestão: renegociar com o proprietário ou reforçar a entrada.</span>
            </Cartao>
            <Cartao ver={f === 2} onde={pct(1010, 460)} tipo="alerta" rotulo="Entrave no vendedor" atraso={0.25}>
              <b>Proprietário sem relatório há 9 dias</b>
              <span className="perfis-sugestao">Sugestão: enviar hoje o relatório de visitas.</span>
            </Cartao>
            <Cartao ver={f === 3} onde={pct(1010, 130)} tipo="doc" rotulo="Jurídico">
              <span className="perfis-check">✓ CPCV assinado</span>
              <span className="perfis-check">✓ Documentos completos</span>
              <span className="perfis-check">✓ AML verificado</span>
            </Cartao>
            <Cartao ver={f === 4} onde={pct(1070, 120)} tipo="dinheiro" rotulo="Comissão">
              <b className="perfis-valor">Recebida e paga</b>
              <span className="perfis-partilha"><i style={{ flex: 55 }}>Agência</i><i style={{ flex: 45 }}>Consultor</i></span>
            </Cartao>
          </div>
        </div>
        </Ajusta>
      </div>
    </section>
  )
}
