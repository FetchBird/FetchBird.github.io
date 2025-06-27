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

  preloadImages(wrapper) {
    const imgs = wrapper.querySelectorAll('img');
    const promises = Array.from(imgs).map(img => {
      return new Promise(resolve => {
        if (img.complete) return resolve();
        img.onload = img.onerror = () => resolve();
      });
    });
    return Promise.all(promises);
  }

  async renderBothSlides(primeira, segunda) {
    const wrapper1 = document.querySelector('.swiper-wrapper');
    const wrapper2 = document.querySelector('.swiperII .swiper-wrapper');
    const loading = document.querySelector('.loading');
    const slidesContainer = document.querySelector('.porfolio_slides');

    if (!wrapper1 || !wrapper2) return;

    // Mostra loading
    if (loading && slidesContainer) {
      loading.style.display = 'flex';
      slidesContainer.style.opacity = '0';
    }

    // Preenche HTML dos dois lados
    wrapper1.innerHTML = primeira.map(item => `
      <div class="swiper-slide">
        <img src="${item.url}" alt="">
        <div class="cardHover hover">
          <button>Começar com este Tema</button>
        </div>
      </div>
    `).join('');

    wrapper2.innerHTML = segunda.map(item => `
      <div class="swiper-slide">
        <img src="${item.url}" alt="">
        <div class="cardHover hover">
          <button>Começar com este Tema</button>
        </div>
      </div>
    `).join('');

    // Aguarda DOM e imagens dos dois lados
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all([
      this.preloadImages(wrapper1),
      this.preloadImages(wrapper2)
    ]);

    // Destroi os antigos
    this.swiperInstance1?.destroy();
    this.swiperInstance2?.destroy();

    // Cria novos Swipers
    this.swiperInstance1 = InitSwiper({
      swiperClass: '.swiper',
      hoverClass: '.hover',
      direcao: 'left',
      velocidade: 50
    });

    this.swiperInstance2 = InitSwiper({
      swiperClass: '.swiperII',
      hoverClass: '.hover',
      direcao: 'right',
      velocidade: 50
    });

    this.swiperInstance1.refreshSlides();
    this.swiperInstance2.refreshSlides();

    // Aplica CSS personalizado se necessário
    if (this.filtroAplicado) {
      [...wrapper1.querySelectorAll('.swiper-slide'), ...wrapper2.querySelectorAll('.swiper-slide')]
        .forEach(slide => {
          slide.style.width = '30%';
        });
    }

    // Finaliza: mostra os slides
    if (loading && slidesContainer) {
      loading.style.display = 'none';
      slidesContainer.style.opacity = '1';
    }
  }

  async initSwipers() {
    const data = await this.loadData();
    const metade = Math.floor(data.length / 2);
    const primeira = data.slice(0, metade);
    const segunda = data.slice(metade).reverse();
    await this.renderBothSlides(primeira, segunda);
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

    await this.renderBothSlides(primeira, segunda);

    const filterOptionals = document.querySelector(".filterOptionals");
    filterOptionals?.classList.toggle('ativo');
  }

  addClearFilter() {
    const clearButton = document.querySelector('.clean');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        const itens = document.querySelectorAll('.filter li');
        itens.forEach(el => {
          el.classList.remove('filterAdd', 'ativo');
        });

        this.categoriasEscolhidas = [];
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
        this.categoriasEscolhidas = Array.from(ativos).map(el => el.textContent.trim());
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

  async init() {
    await this.initSwipers();
    this.catchCategories();
    this.addClearFilter();
  }
}
