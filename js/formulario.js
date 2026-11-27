const id = lerParametro('id');
const editando = Boolean(id);
const form = document.getElementById('form-ponto');
const titulo = document.getElementById('titulo');
const elErro = document.getElementById('erro');
const elCarregando = document.getElementById('carregando');
const secaoForm = document.getElementById('secao-form');
const btnSalvar = document.getElementById('btn-salvar');
const textoBotao = editando ? 'Salvar alterações' : 'Cadastrar';

function preencherFormulario(ponto) {
  for (const campo of ['name', 'description', 'latitude', 'longitude']) {
    form.elements[campo].value = ponto[campo] ?? '';
  }
}

async function iniciar() {
  btnSalvar.textContent = textoBotao;
  criarNavbar(editando ? '' : 'novo');
  if (!editando) {
    mostrar(secaoForm, true);
    return;
  }

  titulo.textContent = 'Editar ponto';
  document.title = 'Editar ponto';
  mostrar(elCarregando, true);
  try {
    const ponto = await buscarPonto(id);
    preencherFormulario(ponto);
    mostrar(secaoForm, true);
  } catch (e) {
    mostrarMensagem(elErro, 'Não foi possível carregar o ponto: ' + e.message);
    mostrar(document.getElementById('voltar'), true);
  } finally {
    mostrar(elCarregando, false);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarMensagem(elErro, '');
  const dados = Object.fromEntries(new FormData(form));

  if (!dados.name.trim() || dados.name.length > 100) {
    mostrarMensagem(elErro, 'Informe um nome com até 100 caracteres.');
    return;
  }
  if (dados.description.length > 255) {
    mostrarMensagem(elErro, 'A descrição deve ter até 255 caracteres.');
    return;
  }
  if (dados.latitude === '' || !Number.isFinite(Number(dados.latitude)) || Number(dados.latitude) < -90 || Number(dados.latitude) > 90) {
    mostrarMensagem(elErro, 'Informe uma latitude entre -90 e 90.');
    return;
  }
  if (dados.longitude === '' || !Number.isFinite(Number(dados.longitude)) || Number(dados.longitude) < -180 || Number(dados.longitude) > 180) {
    mostrarMensagem(elErro, 'Informe uma longitude entre -180 e 180.');
    return;
  }

  // Apenas os quatro campos são enviados. O ID é gerado pela API.
  const ponto = {
    name: dados.name.trim(),
    description: dados.description,
    latitude: Number(dados.latitude),
    longitude: Number(dados.longitude)
  };

  try {
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';
    if (editando) {
      await atualizarPonto(id, ponto);
    } else {
      await criarPonto(ponto);
    }
    window.location.href = 'index.html';
  } catch (e) {
    mostrarMensagem(elErro, 'Erro ao salvar: ' + e.message);
    btnSalvar.disabled = false;
    btnSalvar.textContent = textoBotao;
  }
});

iniciar();
