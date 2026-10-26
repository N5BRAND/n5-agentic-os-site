import Simbolo from '../marca/Simbolo.jsx'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="contentor rodape-linha">
        <Simbolo largura={56} />
        <p className="rodape-nota">Nº5 Agentic OS. Nomes, números e mensagens da demonstração são ilustrativos.</p>
      </div>
      <div className="contentor rodape-linha rodape-base">
        <a href="https://www.instagram.com/somosnumero5" target="_blank" rel="noreferrer">@somosnumero5</a>
        <a href="https://numerocinco.pt" target="_blank" rel="noreferrer">numerocinco.pt</a>
      </div>
    </footer>
  )
}
