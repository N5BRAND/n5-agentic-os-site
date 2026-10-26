# Site do Nº5 Agentic OS: plano de implementação

> Executado inline nesta sessão (pedido do Pedro: plano e implementação de seguida).

**Objetivo:** página única com demo de scroll do Nº5 Agentic OS e lista de espera da pré-venda, publicada no Netlify.

**Arquitetura:** Vite + React. A demo é um palco `sticky` cujo progresso de scroll (`useScroll`) é convertido em cena e avanço por uma função pura. Os dados ilustrativos vivem num só ficheiro. O formulário envia para Netlify Forms.

**Stack:** Vite 6, React 18, `motion` 14.6.0 (`motion/react`), Vitest, Netlify.

Spec: `docs/specs/2026-10-26-site-agentic-os-design.md`.

---

## Ficheiros

```
n5-software-site/
  package.json, vite.config.js, index.html, netlify.toml, .gitignore
  public/favicon.svg                       símbolo oficial
  src/main.jsx, src/App.jsx
  src/estilos/base.css                     tokens da marca, tipografia, utilitários
  src/marca/Simbolo.jsx                    SVG oficial (claro/escuro)
  src/logica/linha-tempo.js                progresso → { indice, avanco }
  src/logica/validar.js                    validação da inscrição
  src/logica/contagem.js                   tempo até 1/12/2026
  src/logica/netlify.js                    codificação do envio
  src/demo/dados.js                        conteúdo ilustrativo das 6 cenas
  src/demo/Demo.jsx                        palco sticky + indicador de cenas
  src/demo/Ficha.jsx                       cartão do negócio (layoutId)
  src/demo/cenas/*.jsx                     uma por cena
  src/demo/ilustracoes/ApertoMao.jsx       aperto de mão em SVG animado
  src/secoes/{Hero,Ecras,Mapa,Perfis,Conformidade,PreVenda,Rodape}.jsx
  testes/*.test.js
```

## Tarefa 1: projeto

- [ ] `package.json` com `vite`, `@vitejs/plugin-react`, `react`, `react-dom`, `motion@14.6.0`, `vitest`; scripts `dev`, `build`, `preview`, `test`.
- [ ] `netlify.toml`: `command = "npm run build"`, `publish = "dist"`.
- [ ] `index.html` com fontes Google (Bricolage Grotesque 800, Archivo 400/600) e formulário escondido `pre-venda` para o Netlify detetar os campos.
- [ ] `npm install`, `npm run build` passa. Commit.

## Tarefa 2: lógica com testes (TDD)

`linha-tempo.js`:

```js
export function cenaDe(progresso, total) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progresso) ? progresso : 0))
  const pos = p * total
  const indice = Math.min(total - 1, Math.floor(pos))
  return { indice, avanco: Math.min(1, pos - indice) }
}
```

Testes: 0 → {0,0}; 0.5 com 6 → {3,0}; 1 → {5,1}; negativos e NaN → {0,0}; acima de 1 → {5,1}.

`validar.js`: `validarInscricao(d)` devolve `{ ok, erros }`; obrigatórios nome, email válido, agência, consentimento `true`; telefone opcional mas, se existir, 9 a 15 dígitos; consultores opcional, inteiro ≥ 1.

`contagem.js`: `LANCAMENTO = new Date('2026-12-01T00:00:00Z')` (Lisboa está em UTC+0 em dezembro); `tempoAte(alvo, agora)` devolve `{ dias, horas, minutos, segundos, terminou }`.

`netlify.js`: `codificar(obj)` → `application/x-www-form-urlencoded`.

`dados.js`: teste garante 6 cenas, ids únicos, cada uma com `ilustrativo: true`, e nenhum texto com «aprova» nem «consentimento».

- [ ] Escrever testes, ver falhar, implementar, ver passar, commit.

## Tarefa 3: marca, base e hero

- [ ] `base.css` com tokens (`--dourado #E8A13C`, `--dourado-escuro #B4761A`, `--tinta #15181D`, `--creme #F5F4F0`, `--cobalto #2B44E7`), tipografia, eyebrow mono.
- [ ] `Simbolo.jsx`: paths oficiais `M25 8 V102 M75 8 V102 M125 8 V102 M175 8 V102` e `M4 88 L200 20`, `stroke-width 16`, `linecap round`; prop `fundo` claro/escuro.
- [ ] `Hero.jsx`: título, subtítulo, CTA para `#pre-venda`, mini painel animado.
- [ ] `App.jsx` com a ordem das secções. Build, commit.

## Tarefa 4: demo

- [ ] `Demo.jsx`: secção de 700vh, palco `position: sticky; top: 0; height: 100vh`; `useScroll({ target })` → `cenaDe` → cena ativa via `AnimatePresence mode="wait"`; indicador de 6 pontos clicável (scroll para a fração certa).
- [ ] Cenas: 1 lead e resposta do agente; 2 chamada e coach; 3 reunião e aperto de mão; 4 proposta e orquestrador; 5 documento em falta; 6 ecrã do broker e aperto de mão.
- [ ] `Ficha.jsx` partilhada com `layoutId="ficha"` entre cenas.
- [ ] Etiqueta «Dados ilustrativos» sempre visível no palco.
- [ ] `useReducedMotion`: cenas empilhadas sem sticky. Commit.

## Tarefa 5: secções

- [ ] `Ecras.jsx`: seletor de 5 papéis com `layoutId` no separador ativo e alerta por papel.
- [ ] `Mapa.jsx`: camadas a entrar com `whileInView` em sequência.
- [ ] `Perfis.jsx`: 3 colunas com passos e junção no jurídico.
- [ ] `Conformidade.jsx`: AMI, AML, RGPD; API só entrada; MCP com permissões do utilizador.
- [ ] Etiquetas «1 de dezembro» e «A seguir». Commit.

## Tarefa 6: pré-venda

- [ ] `PreVenda.jsx`: texto (lançamento 1/12, pré-venda, até 50% nos primeiros pacotes), contagem, formulário com `validarInscricao`, POST `/` com `form-name=pre-venda`, campo honeypot, mensagem de confirmação.
- [ ] `Rodape.jsx`. Commit.

## Tarefa 7: verificação

- [ ] `npm test` e `npm run build` limpos.
- [ ] Browser: scroll completo em computador e 375px, movimento reduzido, validação do formulário.
- [ ] Revisão de texto: PT-PT, sem travessões, sem «aprovação», sem consentimento na demo.
