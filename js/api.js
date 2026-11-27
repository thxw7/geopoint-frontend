// Todas as chamadas à API ficam neste arquivo.
const API_URL = 'http://localhost:8080';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes
  });

  if (!resposta.ok) {
    const tipo = resposta.headers.get('content-type') || '';
    let mensagem;
    if (tipo.includes('application/json')) {
      const corpo = await resposta.json();
      mensagem = corpo.message || corpo.erro;
    } else {
      mensagem = await resposta.text();
    }
    throw new Error(mensagem || `Erro ${resposta.status}`);
  }

  // A exclusão retorna 204, sem corpo JSON.
  if (resposta.status === 204) return null;
  return resposta.json();
}

const listarPontos = () => requisicao('/api/points');
const buscarPonto = (id) => requisicao(`/api/points/${id}`);
const criarPonto = (ponto) =>
  requisicao('/api/points', { method: 'POST', body: JSON.stringify(ponto) });
const atualizarPonto = (id, ponto) =>
  requisicao(`/api/points/${id}`, { method: 'PUT', body: JSON.stringify(ponto) });
const excluirPonto = (id) =>
  requisicao(`/api/points/${id}`, { method: 'DELETE' });
