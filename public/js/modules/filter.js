export function ativarFiltro() {
  const btn = document.querySelector('.cat');
  const listeFilter = document.querySelector('.filter');
  const filterItems = listeFilter.querySelectorAll('li');
  const filterOptionals = document.querySelector(".filterOptionals");
  const filterOpt = document.querySelectorAll(".app");

  // Toggle para abrir/fechar o filtro
  btn.addEventListener('click', (e) => {
    filterOptionals.classList.toggle('ativo');
  });

  filterItems.forEach(li => {
    li.addEventListener('click', (e) => {
      e.target.classList.toggle('ativo');

      // Verifica se ainda existe algum li com a classe 'ativo'
      const algumAtivo = Array.from(filterItems).some(item => item.classList.contains('ativo'));

      filterOpt.forEach(el => {
        if (algumAtivo) {
          el.classList.add('ativo');
        } else {
          el.classList.remove('ativo');
        }
      });
    });
  });

  // Fecha filtro ao clicar fora
  document.addEventListener('click', function (e) {
    if (!filterOptionals.contains(e.target) && !btn.contains(e.target)) {
      filterOptionals.classList.remove('ativo');
    }
  });
}
