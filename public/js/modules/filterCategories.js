import { InitSwiper } from "./swiper.js";

export class FilterCategories {
  constructor(buttonSelector) {
    this.buttonSelector = buttonSelector;
    this.categoriasEscolhidas = [];
    this.swiperInstance1 = null;
    this.swiperInstance2 = null;
    this.filtroAplicado = false;
  }

  async loadData() {
    const res = await fetch('./public/js/libs/temas.json');
    if (!res.ok) throw new Error('Erro ao carregar JSON');
    return res.json();
  }

  ajustarCSS() {
    const slides = document.querySelectorAll('.swiper-slide');
    const slidesContainer = document.querySelector('.porfolio_slides');
    const loading = document.querySelector('.loading');
    if (!slidesContainer || !loading) return;

    slidesContainer.style.opacity = '0';
    loading.style.display = 'flex';

    slides.forEach(slide => {
     
      slide.style.width = '30%';
    });

    setTimeout(() => {
      loading.style.display = 'none';
      slidesContainer.style.opacity = '1';
    }, 2000);
  }

  renderSlides(selector, dados, direction = 'left') {
    const wrapper = document.querySelector(selector);
    if (!wrapper) return;

    const htmlSlides = dados.map(item => `
      <div class="swiper-slide">
        <img src="${item.url}" alt="">
        <div class="cardHover hover">
          <button>Começar com este Tema</button>
        </div>
      </div>
    `).join('');

    wrapper.innerHTML = htmlSlides;

    // Remove instância antiga primeiro
    if (selector.includes('II')) {
      this.swiperInstance2?.destroy();
      this.swiperInstance2 = null;
    } else {
      this.swiperInstance1?.destroy();
      this.swiperInstance1 = null;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const instance = InitSwiper({
          swiperClass: selector.includes('II') ? '.swiperII' : '.swiper',
          hoverClass: '.hover',
          direcao: direction,
          velocidade: 40,
        });

        instance.refreshSlides();

        if (selector.includes('II')) {
          this.swiperInstance2 = instance;
        } else {
          this.swiperInstance1 = instance;
        }

        if (this.filtroAplicado) {
          this.ajustarCSS();
        }
      });
    });
  }

  async initSwipers() {
    const data = await this.loadData();
    this.renderSlides('.swiper-wrapper', data, 'left');
    this.renderSlides('.swiperII .swiper-wrapper', [...data].reverse(), 'right');
  }

  async applyFilter() {
    const data = await this.loadData();
    const filtrar = this.categoriasEscolhidas;
    const mostrarTodos = filtrar.length === 0 || filtrar.includes('Todos');

    const filtrado = mostrarTodos
      ? data
      : data.filter(item =>
          item.categorias.some(cat =>
            filtrar.includes(cat)
          )
        );

    if (filtrado.length % 2 !== 0 && filtrado.length > 0) {
      filtrado.push({ ...filtrado[0] });
    }

    const metade = Math.floor(filtrado.length / 2);
    const primeira = filtrado.slice(0, metade);
    const segunda = filtrado.slice(metade).reverse();

    this.filtroAplicado = true;

    this.renderSlides('.swiper-wrapper', primeira, 'left');
    this.renderSlides('.swiperII .swiper-wrapper', segunda, 'right');

    const filterOptionals = document.querySelector(".filterOptionals");
    filterOptionals?.classList.toggle('ativo');
  }

  addClearFilter() {
    const clearButton = document.querySelector('.clean');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        // Remove .filterAdd e .ativo de todos os <li> dentro de .filter
        const itens = document.querySelectorAll('.filter li');
        itens.forEach(el => {
          el.classList.remove('filterAdd');
          el.classList.remove('ativo');
        });

        // Limpa o array de categorias escolhidas
        this.categoriasEscolhidas = [];

        console.log("Filtros limpos");

        // Reaplica o filtro com a lista vazia
        this.applyFilter();
      });
    }
  }
  

  catchCategories() {
    const itens = document.querySelectorAll('.filter li');
    itens.forEach(li => {
      li.addEventListener('click', () => {
        li.classList.toggle('filterAdd');
        const ativos = document.querySelectorAll('.filter li.filterAdd');
        const textos = Array.from(ativos).map(el => el.textContent.trim());
        this.categoriasEscolhidas = textos;
        console.log("Categorias escolhidas:", this.categoriasEscolhidas);
      });
    });

    this.addFilter();
  }

  addFilter() {
    const button = document.querySelector(this.buttonSelector);
    if (button) {
      button.addEventListener('click', () => this.applyFilter());
    }
  }

  init() {
    this.initSwipers();
    this.catchCategories();
    this.addClearFilter();
  }
}
