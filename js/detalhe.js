const id = lerParametro('id');
const elCarregando = document.getElementById('carregando');
const elErro = document.getElementById('erro');
const secaoDetalhe = document.getElementById('secao-detalhe');
const btnExcluir = document.getElementById('btn-excluir');
let ponto = null;

function preencherTela() {
  document.getElementById('id-ponto').textContent = ponto.id;
  document.getElementById('nome').textContent = ponto.name;
  document.getElementById('descricao').textContent = ponto.description || '—';
  document.getElementById('latitude').textContent = ponto.latitude;
  document.getElementById('longitude').textContent = ponto.longitude;
  document.getElementById('btn-editar').href = `formulario.html?id=${ponto.id}`;
  mostrar(secaoDetalhe, true);
}

async function carregar() {
  try {
    if (!id) throw new Error('Nenhum ponto informado na URL.');
    ponto = await buscarPonto(id);
    preencherTela();
  } catch (e) {
    mostrarMensagem(elErro, 'Não foi possível carregar o ponto: ' + e.message);
  } finally {
    mostrar(elCarregando, false);
  }
}

btnExcluir.addEventListener('click', async () => {
  if (!confirm(`Excluir "${ponto.name}"?`)) return;
  mostrarMensagem(elErro, '');
  try {
    btnExcluir.disabled = true;
    await excluirPonto(id);
    window.location.href = 'index.html';
  } catch (e) {
    mostrarMensagem(elErro, 'Erro ao excluir: ' + e.message);
    btnExcluir.disabled = false;
  }
});

criarNavbar('');
carregar();
