export class ScrollButtonHandler {
  constructor(buttonSelector, percentage = 0.4) {
    this.buttonSelector = buttonSelector;
    this.button = document.querySelector(this.buttonSelector);
    this.scrollPercentage = percentage;

    this.handleScroll = this.handleScroll.bind(this);
  }

  init() {
    if (!this.button) {
      console.warn(`Elemento ${this.buttonSelector} não encontrado.`);
      return;
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const nav = document.querySelector('nav[aria-label="nav_principal"]');
    const threshold = window.innerHeight * this.scrollPercentage;

    if (window.scrollY > threshold) {
      nav.classList.remove('on');
      this.button.classList.remove('on');
    }
  }
}
