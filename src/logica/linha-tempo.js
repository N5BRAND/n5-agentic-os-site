/* converte o progresso do scroll (0 a 1) na cena ativa e no avanço dentro dela */
export function cenaDe(progresso, total) {
  const p = Math.min(1, Math.max(0, Number.isFinite(progresso) ? progresso : 0))
  const pos = p * total
  const indice = Math.min(total - 1, Math.floor(pos))
  return { indice, avanco: Math.min(1, pos - indice) }
}
