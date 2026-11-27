const campoBusca = document.getElementById('campo-busca');
const elCarregando = document.getElementById('carregando');
const elErro = document.getElementById('erro');
const elVazio = document.getElementById('vazio');
const tabela = document.getElementById('tabela');
const corpoTabela = document.getElementById('corpo-tabela');

let pontos = [];
let carregado = false;

function criarCelula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function criarLinhaPonto(ponto) {
  const tr = document.createElement('tr');
  const tdNome = document.createElement('td');
  tdNome.appendChild(criarLink(ponto.name, `ponto.html?id=${ponto.id}`));

  const tdAcoes = document.createElement('td');
  const acoes = document.createElement('div');
  acoes.className = 'acoes';
  acoes.append(
    criarLink('Ver', `ponto.html?id=${ponto.id}`, 'botao secundario'),
    criarLink('Editar', `formulario.html?id=${ponto.id}`, 'botao secundario'),
    criarBotao('Excluir', () => handleExcluir(ponto.id, ponto.name), 'perigo')
  );
  tdAcoes.appendChild(acoes);

  tr.append(tdNome, criarCelula(ponto.description || '—'),
    criarCelula(ponto.latitude), criarCelula(ponto.longitude), tdAcoes);
  return tr;
}

function render() {
  if (!carregado) return;
  const termo = campoBusca.value.trim().toLowerCase();
  // O filtro é feito sobre a lista recebida, sem chamar a API novamente.
  const filtrados = pontos.filter((p) => p.name.toLowerCase().includes(termo));
  corpoTabela.textContent = '';
  filtrados.forEach((p) => corpoTabela.appendChild(criarLinhaPonto(p)));
  mostrar(tabela, filtrados.length > 0);
  mostrar(elVazio, filtrados.length === 0);
}

async function carregar() {
  try {
    pontos = await listarPontos();
    carregado = true;
    render();
  } catch (e) {
    mostrarMensagem(elErro, 'Não foi possível carregar os pontos. A API está rodando? (' + e.message + ')');
  } finally {
    mostrar(elCarregando, false);
  }
}

async function handleExcluir(id, nome) {
  if (!confirm(`Excluir "${nome}"?`)) return;
  mostrarMensagem(elErro, '');
  try {
    await excluirPonto(id);
    pontos = pontos.filter((p) => p.id !== id);
    render();
  } catch (e) {
    mostrarMensagem(elErro, 'Erro ao excluir: ' + e.message);
  }
}

criarNavbar('lista');
campoBusca.addEventListener('input', render);
carregar();
