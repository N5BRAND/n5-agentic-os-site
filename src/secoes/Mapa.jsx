import { motion } from 'motion/react'

const AGENTES = [
  { dep: 'Comercial', agente: 'Agente de leads', faz: 'Responde, segue e cruza imóveis' },
  { dep: 'Consultor', agente: 'Agente do dia', faz: 'Prioriza o dia e faz coaching' },
  { dep: 'Crédito', agente: 'Agente de crédito', faz: 'Pede documentos e segue o banco' },
  { dep: 'Jurídico', agente: 'Agente jurídico', faz: 'Checklist CPCV, prazos e AML' },
  { dep: 'Financeiro', agente: 'Agente financeiro', faz: 'Comissões, prazos e previsão' },
]

const entra = (i = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { type: 'spring', stiffness: 110, damping: 20, delay: i * 0.08 },
})

function Ligacao() {
  return (
    <motion.span
      className="mapa-ligacao"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.5 }}
      aria-hidden="true"
    />
  )
}

export default function Mapa() {
  return (
    <section id="sistema" className="seccao escuro mapa">
      <div className="contentor">
        <div className="seccao-cabeca">
          <p className="eyebrow">O mapa do sistema</p>
          <h2>Um agente por departamento. Um orquestrador a ligar tudo.</h2>
          <p>Por baixo, uma só ficha por negócio, que passa de departamento em departamento sem se perder informação.</p>
        </div>

        <motion.div className="mapa-camada mapa-topo" {...entra()}>
          <b>Controlo da operação</b>
          <span>Agente do broker: resumo semanal, alertas, objetivos e reuniões preparadas</span>
        </motion.div>
        <Ligacao />
        <div className="mapa-agentes">
          {AGENTES.map((a, i) => (
            <motion.div key={a.dep} className="mapa-agente" {...entra(i)}>
              <b>{a.dep}</b>
              <span className="mapa-agente-nome">{a.agente}</span>
              <span>{a.faz}</span>
            </motion.div>
          ))}
        </div>
        <Ligacao />
        <motion.div className="mapa-camada mapa-orq" {...entra()}>
          <motion.span
            className="mapa-orq-brilho"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            aria-hidden="true"
          />
          <b>Orquestrador de passagens</b>
          <span>Lê cada evento, entrega a informação certa a cada pessoa e avisa quem está à espera</span>
        </motion.div>
        <Ligacao />
        <motion.div className="mapa-camada" {...entra()}>
          <b>Ficha única do negócio</b>
          <span>Comunicação, passagens, tarefas e histórico entre departamentos</span>
        </motion.div>
        <Ligacao />
        <motion.div className="mapa-camada" {...entra()}>
          <b>Copiloto no browser</b>
          <span>Regista os dados no CRM da agência e responde ao consultor onde ele já trabalha</span>
        </motion.div>
        <Ligacao />
        <motion.div className="mapa-camada mapa-dados" {...entra()}>
          <b>Dados e ligações</b>
          <span>WhatsApp, email, agenda, portais, CRM existente e dados de mercado</span>
        </motion.div>
        <div className="mapa-portas">
          <motion.div className="mapa-porta" {...entra(0)}>
            <b>API · só entrada</b>
            <span>Portais, CRM, banco e formulários enviam dados. Nunca serve para os tirar.</span>
          </motion.div>
          <motion.div className="mapa-porta" {...entra(1)}>
            <b>MCP · ChatGPT e Claude</b>
            <span>Consultar, exportar e mover negócios, sempre com as permissões de cada pessoa.</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
