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

    // Destroi Swipers antes de mexer no DOM
    this.swiperInstance1?.destroy(true, true);
    this.swiperInstance2?.destroy(true, true);
    this.swiperInstance1 = null;
    this.swiperInstance2 = null;

    // Aguarda um pequeno delay para o DOM respirar
    await new Promise(resolve => setTimeout(resolve, 100));

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

    // Aguarda imagens
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all([
      this.preloadImages(wrapper1),
      this.preloadImages(wrapper2)
    ]);

    // Pequeno delay para prevenir travadas na reexecução do Swiper
    await new Promise(resolve => setTimeout(resolve, 100));

    // Cria os Swipers com autoplay já ativo
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

    // Aplica largura personalizada
    if (this.filtroAplicado) {
      const slides1 = wrapper1.querySelectorAll('.swiper-slide');
      const slides2 = wrapper2.querySelectorAll('.swiper-slide');

      const largura1 = slides1.length === 2 ? '50%' : '30%';
      const largura2 = slides2.length === 2 ? '50%' : '30%';

      slides1.forEach(slide => (slide.style.width = largura1));
      slides2.forEach(slide => (slide.style.width = largura2));
    }

    // Finaliza visual
    if (loading && slidesContainer) {
      loading.style.display = 'none';
      slidesContainer.style.opacity = '1';
    }
  }
  

  async initSwipers() {
    const data = await this.loadData();

    // Garante mínimo de 6 slides
    while (data.length < 6) {
      const index = data.length % Math.max(data.length, 1);
      const item = data[index];
      if (item?.url) {
        data.push({ ...item });
      } else {
        break;
      }
    }

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
        item.categorias?.some(cat =>
          filtrar.includes(cat)
        )
      );

    // Garante pelo menos 6 slides
    while (filtrado.length < 6) {
      const index = filtrado.length % Math.max(filtrado.length, 1);
      const item = filtrado[index];
      if (item?.url) {
        filtrado.push({ ...item });
      } else {
        break;
      }
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
