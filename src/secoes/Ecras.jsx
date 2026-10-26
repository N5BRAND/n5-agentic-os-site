import { motion, AnimatePresence, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const PAPEIS = [
  {
    id: 'broker', nome: 'Broker', quando: '1 de dezembro',
    recebe: ['Resumo semanal por consultor e por equipa', 'Funil e previsão de faturação', 'Comissões a caminho'],
    alerta: 'Três escrituras deste mês dependem de crédito ainda não aprovado.',
  },
  {
    id: 'consultor', nome: 'Consultor', quando: '1 de dezembro',
    recebe: ['Leads já respondidas e qualificadas', 'Coaching depois de cada chamada', 'O próximo passo de cada negócio'],
    alerta: 'Visita de ontem sem feedback do comprador.',
  },
  {
    id: 'credito', nome: 'Crédito', quando: 'A seguir',
    recebe: ['Compradores novos com contexto', 'Documentos recebidos', 'Prazos do banco'],
    alerta: 'Falta o IRS do comprador para submeter ao banco.',
  },
  {
    id: 'juridico', nome: 'Jurídico', quando: 'A seguir',
    recebe: ['Dossiers abertos e documentos em falta', 'Prazos de CPCV e escritura', 'Estado AML de cada processo'],
    alerta: 'Escritura marcada sem certidão atualizada.',
  },
  {
    id: 'financeiro', nome: 'Financeiro', quando: 'A seguir',
    recebe: ['Comissões previstas e devidas', 'Partilhas e recebimentos em atraso', 'Pagamentos a consultores'],
    alerta: 'Comissão da escritura de sexta por faturar.',
  },
]

export default function Ecras() {
  const [ativo, setAtivo] = useState(0)
  const [manual, setManual] = useState(false)
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.4 })

  /* roda sozinho enquanto ninguém mexe */
  useEffect(() => {
    if (manual || !visivel) return
    const t = setInterval(() => setAtivo(a => (a + 1) % PAPEIS.length), 4200)
    return () => clearInterval(t)
  }, [manual, visivel])

  const p = PAPEIS[ativo]
  return (
    <section ref={ref} className="seccao ecras">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Cada pessoa vê o seu ecrã</p>
          <h2>Os mesmos dados. Ninguém tem de ir procurar.</h2>
          <p>O sistema entrega a cada pessoa só o que lhe diz respeito, no momento certo.</p>
        </div>

        <div className="ecras-separadores" role="tablist" aria-label="Papéis">
          {PAPEIS.map((x, i) => (
            <button
              key={x.id} role="tab" type="button"
              aria-selected={i === ativo}
              className={i === ativo ? 'ativo' : ''}
              onClick={() => { setManual(true); setAtivo(i) }}
            >
              {i === ativo && <motion.span layoutId="ecras-marca" className="ecras-marca" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{x.nome}</span>
            </button>
          ))}
        </div>

        <div className="cartao ecras-ecra" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              className="ecras-conteudo"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <div className="ecras-topo">
                <h3>Ecrã do {p.nome.toLowerCase()}</h3>
                <span className={`etiqueta ${p.quando === 'A seguir' ? 'etiqueta--seguir' : ''}`}>{p.quando}</span>
              </div>
              <div className="ecras-colunas">
                <div>
                  <span className="eyebrow">Recebe sem pedir</span>
                  <ul>
                    {p.recebe.map((r, i) => (
                      <motion.li key={r} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.08 }}>{r}</motion.li>
                    ))}
                  </ul>
                </div>
                <motion.div
                  className="ecras-alerta"
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.35 }}
                >
                  <span className="eyebrow">Exemplo de alerta</span>
                  <p>«{p.alerta}»</p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          {!manual && visivel && (
            <motion.div key={ativo} className="ecras-tempo" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.2, ease: 'linear' }} />
          )}
        </div>
        <p className="ecras-nota">Alertas ilustrativos.</p>
      </div>
    </section>
  )
}
