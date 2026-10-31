import { motion, AnimatePresence, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Simbolo from '../marca/Simbolo.jsx'

/* o percurso real de um negócio pela agência: cada departamento recebe o que precisa do anterior.
   Substitui o polvo com nove braços (pedido do Pedro, 31/10): menos ligações à vista, mais o caminho de um negócio */
export const PERCURSO = [
  { id: 'portais', titulo: 'Portais e site', texto: 'Entrou uma lead: contacto, imóvel de interesse e resposta já enviada.' },
  { id: 'comercial', titulo: 'Comercial', texto: 'O comprador quer avançar: perfil, valor da proposta e entrada seguem para o crédito.' },
  { id: 'credito', titulo: 'Crédito', texto: 'Crédito aprovado: valor e data possível da escritura seguem para o jurídico.' },
  { id: 'juridico', titulo: 'Jurídico', texto: 'Falta um documento: o pedido segue para o cliente. CPCV assinado: a comissão prevista segue para o financeiro.' },
  { id: 'financeiro', titulo: 'Financeiro', texto: 'Comissões a caminho: de que negócios, quando entram e a quem se pagam.' },
  { id: 'direcao', titulo: 'Direção', texto: 'O broker vê o negócio inteiro: o que está parado, onde e o que entra este mês.' },
]

/* o que se liga ao sistema, à volta do percurso */
const LIGACOES = [
  { titulo: 'WhatsApp, email e agenda', texto: 'As conversas e as visitas entram sozinhas.' },
  { titulo: 'Copiloto no CRM', texto: 'Regista visitas, contactos e notas no CRM da tua rede, sem ninguém escrever à mão.' },
  { titulo: 'ChatGPT e Claude', texto: 'Perguntas ao sistema e mexes nos teus negócios a partir do teu assistente, só com as tuas permissões.' },
]

export default function Mapa() {
  const ref = useRef(null)
  const visivel = useInView(ref, { amount: 0.35 })
  const [ativo, setAtivo] = useState(0)
  useEffect(() => {
    if (!visivel) return
    const t = setInterval(() => setAtivo(a => (a + 1) % PERCURSO.length), 3200)
    return () => clearInterval(t)
  }, [visivel])

  const passo = PERCURSO[ativo]

  return (
    <section id="sistema" ref={ref} className="seccao escuro mapa">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Como tudo se liga</p>
          <h2>Um negócio passa por toda a agência. A informação vai com ele.</h2>
          <p>Do primeiro contacto à comissão paga, cada departamento recebe do anterior o que precisa, no N5 Imobiliário, sem ninguém ter de o levar.</p>
        </div>

        <ol className="percurso" aria-label="O percurso de um negócio">
          {PERCURSO.map((d, i) => (
            <li key={d.id} className={`percurso-passo ${i === ativo ? 'percurso-passo--ativo' : ''} ${i < ativo ? 'percurso-passo--feito' : ''}`}>
              <button type="button" onClick={() => setAtivo(i)} aria-pressed={i === ativo}>
                <span className="percurso-n">{String(i + 1).padStart(2, '0')}</span>
                <b>{d.titulo}</b>
              </button>
            </li>
          ))}
        </ol>

        <div className="polvo-legenda" aria-live="polite">
          <span className="eyebrow">O que passa agora</span>
          <AnimatePresence mode="wait">
            <motion.p key={ativo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <b>{passo.titulo}.</b> {passo.texto}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="percurso-ligacoes">
          <div className="percurso-centro"><Simbolo largura={44} /><b>N5 Imobiliário</b></div>
          {LIGACOES.map(l => (
            <div key={l.titulo} className="percurso-ligacao"><b>{l.titulo}</b><span>{l.texto}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}
