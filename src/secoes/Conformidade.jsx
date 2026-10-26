import { motion } from 'motion/react'

const BLOCOS = [
  { titulo: 'AMI', texto: 'A licença e os deveres de informação fazem parte de cada passagem.' },
  { titulo: 'AML', texto: 'Identificação dos clientes e origem dos fundos verificadas antes da escritura.' },
  { titulo: 'RGPD', texto: 'Conservação, acessos e pedidos de apagamento tratados dentro do processo.' },
  { titulo: 'Números com memória', texto: 'Cada valor guarda de onde veio, para saberes meses depois porque deste aquele número.' },
]

export default function Conformidade() {
  return (
    <section className="seccao conformidade">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">Conformidade de origem</p>
          <h2>Não é um extra. Está no processo.</h2>
        </div>
        <div className="conformidade-grelha">
          {BLOCOS.map((b, i) => (
            <motion.div
              key={b.titulo}
              className="cartao conformidade-bloco"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20, delay: i * 0.08 }}
            >
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
