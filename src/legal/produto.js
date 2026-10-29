/* o que muda de site para site nas páginas legais */
export const PRODUTO = {
  nome: 'N5 Imobiliário',
  url: 'https://n5-agentic-os.netlify.app',
  formulario: 'lista de espera da pré-venda',
  campos: ['nome', 'email', 'telefone (opcional)', 'nome da agência', 'licença AMI da agência', 'número de consultores (opcional)', 'as prioridades que escolhes e o CRM que usas (opcional, no passo seguinte)'],
  finalidades: [
    'gerir a lista de espera da pré-venda do N5 Imobiliário;',
    'identificar a agência que se inscreveu, através da licença AMI;',
    'perceber o que é mais importante para a tua agência, para te mostrarmos isso primeiro e decidirmos o que desenvolver primeiro;',
    'contactar-te sobre a abertura da pré-venda, as suas condições e o lançamento previsto para 1 de dezembro de 2026.',
  ],
  reserva: { valor: '100 €', garante: 'uma das 25 licenças com 50% de desconto na primeira mensalidade' },
  oferta: 'Para a pré-venda anunciámos 25 licenças com 50% de desconto na primeira mensalidade e um pacote de 12 formações anuais sobre o sistema. Cada licença garante-se com uma pré-reserva de 100 €, descontada na primeira mensalidade e reembolsável após o dia do lançamento. O valor anunciado para o lançamento é de 299 € por mês; nas 25 licenças da pré-venda, a primeira mensalidade tem 50% de desconto e fica a 149,50 €, de onde se descontam os 100 € da pré-reserva (49,50 € no primeiro mês). A partir da segunda mensalidade aplica-se o valor anunciado. O pagamento é feito na Stripe e recebido pela 4IMPROVEMENTS, LDA, que aparece no extrato.',
}
