import { motion } from 'motion/react'
import Revela from '../Revela.jsx'
import { Pessoa } from '../ilustracoes/Pessoas.jsx'

const BARRAS = Array.from({ length: 22 }, (_, i) => i)

function Onda({ viva }) {
  return (
    <div className="onda" aria-hidden="true">
      {BARRAS.map(i => (
        <motion.i
          key={i}
          animate={viva ? { scaleY: [0.25, 1, 0.4, 0.8, 0.3] } : { scaleY: 0.18 }}
          transition={viva ? { duration: 1.1 + (i % 5) * 0.17, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 } : { duration: 0.3 }}
        />
      ))}
    </div>
  )
}

export default function CenaCoach({ cena, passo }) {
  const emChamada = passo <= 2
  return (
    <div className="cena cena-coach" data-fase={passo >= 5 ? 'pipeline' : passo >= 4 ? 'proximo' : 'chamada'}>
      <div className="coach-esq">
        <Revela ver={passo >= 1} className="cartao chamada">
          <div className="chamada-topo">
            <div className="chamada-pessoa">
              <Pessoa largura={78} cor="#15181D" acessorio="auscultadores" fala={emChamada} />
            </div>
            <div>
              <b>Rui · {emChamada ? 'em chamada' : 'chamada terminada'}</b>
              <span className="suave">com {cena.chamada.com} · {cena.chamada.duracao}</span>
            </div>
            <span className={`ponto-vivo ${emChamada ? '' : 'ponto-vivo--off'}`} />
          </div>
          <Onda viva={emChamada} />
        </Revela>
        <Revela ver={passo >= 2} className="cartao transcricao">
          <span className="eyebrow">Transcrição</span>
          {cena.transcricao.map((l, i) => (
            <Revela key={i} ver={passo >= 2} atraso={0.12 + i * 0.22} className={`linha-fala linha-fala--${l.de}`}>
              <b>{l.de === 'consultor' ? 'Rui' : 'Marta'}</b> {l.texto}
            </Revela>
          ))}
        </Revela>
      </div>

      <div className="coach-dir">
        <div className="cartao coach">
          <div className="coach-cabeca">
            <span className="coach-ia">IA</span>
            <b>Coach de chamadas</b>
          </div>
          <Revela ver={passo >= 3} className="coach-bloco">
            <span className="coach-rotulo coach-rotulo--bem">Correu bem</span>
            <ul>{cena.feedback.bem.map(t => <li key={t}>{t}</li>)}</ul>
          </Revela>
          <Revela ver={passo >= 3} atraso={0.15} className="coach-bloco">
            <span className="coach-rotulo coach-rotulo--mal">A melhorar</span>
            <ul>{cena.feedback.mal.map(t => <li key={t}>{t}</li>)}</ul>
          </Revela>
          <Revela ver={passo >= 4} className="coach-proximo">
            <span className="eyebrow">Próximo follow-up</span>
            <p>{cena.feedback.proximo}</p>
          </Revela>
          <Revela ver={passo >= 5} className="coach-pipeline">
            <span className="eyebrow">O teu pipeline</span>
            <div className="coach-numeros">
              {cena.pipeline.map(p => (
                <div key={p.rotulo}>
                  <span className="numero">{p.valor}</span>
                  <span>{p.rotulo}</span>
                </div>
              ))}
            </div>
            <p className="coach-sugestao">{cena.sugestao}</p>
          </Revela>
        </div>
        <Revela ver={passo >= 6} de={30} className="resultado">
          <span className="resultado-icone" aria-hidden="true">✓</span> {cena.resultado}
        </Revela>
      </div>
    </div>
  )
}
