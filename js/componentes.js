// Funções reutilizadas nas páginas.
function criarLink(texto, endereco, classe = '') {
  const link = document.createElement('a');
  link.textContent = texto;
  link.href = endereco;
  link.className = classe;
  return link;
}

function criarBotao(texto, acao, classe = '') {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.className = classe;
  botao.addEventListener('click', acao);
  return botao;
}

function criarNavbar(pagina) {
  const navbar = document.getElementById('navbar');
  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.textContent = 'GeoPoint';
  const nav = document.createElement('nav');
  nav.append(
    criarLink('Pontos', 'index.html', pagina === 'lista' ? 'active' : ''),
    criarLink('Novo ponto', 'formulario.html', pagina === 'novo' ? 'active' : '')
  );
  navbar.append(logo, nav);
}

function lerParametro(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

function mostrar(elemento, visivel) {
  elemento.classList.toggle('escondido', !visivel);
}

function mostrarMensagem(elemento, mensagem) {
  elemento.textContent = mensagem;
  mostrar(elemento, Boolean(mensagem));
}
