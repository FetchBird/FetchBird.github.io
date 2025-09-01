// modules/showTemplates.js
export default class ShowTemplates {
  constructor(buttonSelector, containerSelector, activeClass = 'active') {
    this.button = document.querySelector(buttonSelector);
    this.out = document.querySelector('.out');
    this.container = document.querySelector(containerSelector);
    this.activeClass = activeClass;

    if (!this.button || !this.container) {
      console.error('Elemento não encontrado. Verifique os seletores.');
      return;
    }

    this.init();
  }

  init() {
    this.button.addEventListener('click', () => {
      this.toggleContainer();
    });

    this.out.addEventListener('click', () => {
      this.container.classList.remove(this.activeClass);
    });

    // Fechar ao clicar fora do container
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target) && e.target !== this.button) {
        this.hideContainer();
      }
    });

    // Prevenir que cliques dentro do container fechem ele
    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  toggleContainer() {
    this.container.classList.add(this.activeClass);

    // Opcional: adicionar aria-expanded para acessibilidade
    const isExpanded = this.container.classList.contains(this.activeClass);
    this.button.setAttribute('aria-expanded', isExpanded);
  }

  showContainer() {
    this.container.classList.add(this.activeClass);
    this.button.setAttribute('aria-expanded', 'true');
  }

  hideContainer() {
    this.container.classList.remove(this.activeClass);
    this.button.setAttribute('aria-expanded', 'false');
  }
}