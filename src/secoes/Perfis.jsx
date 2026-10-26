import { motion } from 'motion/react'

const PERFIS = [
  { nome: 'Comprador', passos: ['Lead compradora', 'Seguimento', 'Visitas e feedback', 'Proposta aceite', 'Financiamento: a pronto, crédito pela agência ou crédito externo'] },
  { nome: 'Vendedor', passos: ['Lead proprietária', 'Seguimento e avaliação', 'Angariação do imóvel', 'Visitas ao imóvel', 'Relatório ao proprietário'] },
  { nome: 'Investidor', passos: ['Lead investidora', 'Seguimento', 'Oportunidades e SPVs', 'Visitas e análise', 'Proposta ou subscrição'] },
]

const FIM = ['CPCV, documentos e AML', 'Escritura', 'Comissão recebida e paga']

export default function Perfis() {
  return (
    <section className="seccao perfis">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Três perfis, um destino</p>
          <h2>Cada cliente tem o seu percurso. Todos acabam na comissão.</h2>
          <p>Comprador, vendedor e investidor seguem caminhos diferentes e juntam-se no jurídico. E o matching liga compradores e imóveis da tua carteira, nos dois sentidos.</p>
        </div>
        <div className="perfis-colunas">
          {PERFIS.map((p, c) => (
            <div key={p.nome} className="perfis-coluna">
              <h3>{p.nome}</h3>
              <ol>
                {p.passos.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 20, delay: c * 0.12 + i * 0.07 }}
                  >{s}</motion.li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="perfis-fim">
          {FIM.map((f, i) => (
            <motion.div
              key={f}
              className={`perfis-fim-passo ${i === 1 ? 'perfis-fim-passo--destaque' : ''}`}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 + i * 0.15 }}
            >{f}</motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
