import Revela from '../Revela.jsx'
import ApertoMao from '../ilustracoes/ApertoMao.jsx'

export default function CenaReuniao({ cena, passo }) {
  return (
    <div className="cena cena-reuniao">
      <Revela ver={passo >= 1} className="cartao briefing">
        <span className="eyebrow">Briefing preparado pela IA</span>
        <ul>
          {cena.briefing.map((b, i) => (
            <Revela key={b} como="li" ver={passo >= 1} atraso={0.1 + i * 0.12}>{b}</Revela>
          ))}
        </ul>
      </Revela>
      <ApertoMao
        ver={passo >= 2}
        apertar={passo >= 3}
        esquerda={{ nome: 'Rui', papel: 'consultor', cor: '#15181D' }}
        direita={{ nome: 'Marta', papel: 'lead', cor: '#E8A13C' }}
      />
    </div>
  )
}
