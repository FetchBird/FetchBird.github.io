const btn = document.querySelector('.cat');
const listeFilter = document.querySelector('.filter');
const filterItems = listeFilter.querySelectorAll('li');

export function ativarFiltro() {
  // Toggle para abrir/fechar o filtro
  btn.addEventListener('click', (e) => {
 
    listeFilter.classList.toggle('ativo');
  });



  filterItems.forEach(li => {
    li.addEventListener('click', (e) => {
      console.log('====================================');
      console.log(e);
      console.log('====================================');
      e.target.classList.toggle('ativo');
    });
  });

  // Fecha filtro ao clicar fora
  document.addEventListener('click', function (e) {
    if (!listeFilter.contains(e.target) && !btn.contains(e.target)) {
      listeFilter.classList.remove('ativo');
    }
  });
}
