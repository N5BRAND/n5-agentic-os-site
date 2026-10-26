import Topo from './secoes/Topo.jsx'
import Hero from './secoes/Hero.jsx'
import Demo from './demo/Demo.jsx'
import Ecras from './secoes/Ecras.jsx'
import Mapa from './secoes/Mapa.jsx'
import Perfis from './secoes/Perfis.jsx'
import Conformidade from './secoes/Conformidade.jsx'
import PreVenda from './secoes/PreVenda.jsx'
import Rodape from './secoes/Rodape.jsx'

export default function App() {
  return (
    <>
      <Topo />
      <main>
        <Hero />
        <Demo />
        <Ecras />
        <Mapa />
        <Perfis />
        <Conformidade />
        <PreVenda />
      </main>
      <Rodape />
    </>
  )
}
