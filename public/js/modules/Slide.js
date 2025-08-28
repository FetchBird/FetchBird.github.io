// Slide.js — Loop infinito suave (A|B|C) com salto de K e SEM tranco
export default class Slide {
  constructor(containerSelector, options = {}) {
    // elementos
    this.container = document.querySelector(containerSelector);
    if (!this.container) throw new Error(`Slide: container "${containerSelector}" não encontrado.`);
    this.wrapper = this.container.querySelector('.slides-wrapper');
    if (!this.wrapper) throw new Error('Slide: .slides-wrapper não encontrado dentro do container.');
    this.nextBtn = this.container.querySelector('.slide-btn.next');
    this.prevBtn = this.container.querySelector('.slide-btn.prev');

    this.autoplay = typeof options.autoplay === "number" ? options.autoplay : 0;
    this._autoTimer = null;

    // opções
    this.slidesToScroll = Number.isInteger(options.slidesToScroll) ? Math.max(1, options.slidesToScroll) : 1;
    this.duration = typeof options.duration === 'number' ? options.duration : 450; // ms

    // estado
    this.originalSlides = Array.from(this.wrapper.querySelectorAll('.slide_site'));
    this.blockSize = this.originalSlides.length; // N (quantidade real)
    if (this.blockSize < 1) return;

    this.slides = [];            // depois de clonar vira A|B|C
    this.currentIndex = 0;       // será setado para N (início do bloco B)
    this.step = 0;
    this.isAnimating = false;

    // binds
    this._onResize = this._onResize.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);

    // touch
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._touchStartX = 0;
    this._touchCurX = 0;
    this._isSwiping = false;

    this._init();
  }

  /* =================== init & infra A|B|C =================== */
  _init() {
    this._buildTripleBlock();       // monta A | B | C
    this.currentIndex = this.blockSize; // começa em B (primeiro real alinhado)

    this._updateStep();
    this._setTransform(this.currentIndex, false); // posiciona sem animar

    if (this.nextBtn) this.nextBtn.addEventListener('click', this._next);
    if (this.prevBtn) this.prevBtn.addEventListener('click', this._prev);
    window.addEventListener('resize', this._onResize);
    this.wrapper.addEventListener('transitionend', this._onTransitionEnd);

    // touch
    this.wrapper.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.wrapper.addEventListener('touchmove', this._onTouchMove, { passive: true });
    this.wrapper.addEventListener('touchend', this._onTouchEnd);

    if (this.autoplay > 0) {
      this._startAutoplay();
    }
  }
  _startAutoplay() {
    this._stopAutoplay(); // garante que não duplica
    this._autoTimer = setInterval(() => {
      if (!this.isAnimating) this._next();
    }, this.autoplay);
  }

  _stopAutoplay() {
    if (this._autoTimer) {
      clearInterval(this._autoTimer);
      this._autoTimer = null;
    }
  }

  _buildTripleBlock() {
    // Limpa e cria: A (clone), B (original), C (clone)
    const fragA = document.createDocumentFragment();
    const fragC = document.createDocumentFragment();

    const clonesA = this.originalSlides.map(n => n.cloneNode(true)); // antes
    const clonesC = this.originalSlides.map(n => n.cloneNode(true)); // depois

    clonesA.forEach(n => fragA.appendChild(n));
    clonesC.forEach(n => fragC.appendChild(n));

    this.wrapper.innerHTML = '';
    // A
    this.wrapper.appendChild(fragA);
    // B (originais)
    this.originalSlides.forEach(n => this.wrapper.appendChild(n));
    // C
    this.wrapper.appendChild(fragC);

    this.slides = Array.from(this.wrapper.querySelectorAll('.slide_site'));
  }

  /* =================== medidas & transform =================== */
  _updateStep() {
    // passo baseado em offsetLeft (estável com gap + flex)
    if (this.slides.length > 1) {
      const s0 = this.slides[0];
      const s1 = this.slides[1];
      const step = Math.round(s1.offsetLeft - s0.offsetLeft);
      this.step = step > 0 ? step : this.slides[0].offsetWidth;
    } else {
      this.step = this.slides[0].offsetWidth;
    }
  }

  _setTransform(index, animated) {
    this.wrapper.style.transition = animated
      ? `transform ${this.duration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`
      : 'none';
    this.wrapper.style.transform = `translateX(${-(index * this.step)}px)`;
  }

  /* =================== navegação (EVITA tranco) =================== */
  _move(dir /* +1 ou -1 */) {
    if (this.isAnimating) return;
    this._updateStep();

    const N = this.blockSize;
    const kRaw = this.slidesToScroll % N;           // evita pular múltiplo de N virar 0
    const k = kRaw === 0 ? N : kRaw;

    // ponto de partida
    let from = this.currentIndex;
    let to = from + dir * k;

    // Garantir que a ANIMAÇÃO ocorra dentro do bloco B [N .. 2N-1]
    // Se o destino saiu para C, traz ambos (from/to) -N.
    // Se o destino saiu para A, empurra ambos +N.
    while (to >= 2 * N) { from -= N; to -= N; }
    while (to < N) { from += N; to += N; }

    // 1) Teleporta p/ 'from' SEM transição (ninguém vê)
    this.isAnimating = true;
    this.wrapper.style.transition = 'none';
    this.currentIndex = from;
    this.wrapper.style.transform = `translateX(${-(from * this.step)}px)`;
    // força reflow para garantir que o próximo set tenha transição
    void this.wrapper.offsetWidth;

    // 2) Agora anima de 'from' → 'to' DENTRO de B (suave)
    this.wrapper.style.transition = `transform ${this.duration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
    this.currentIndex = to;
    this.wrapper.style.transform = `translateX(${-(to * this.step)}px)`;
  }

  _next() { this._move(+1); }
  _prev() { this._move(-1); }

  _onTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    this.isAnimating = false;
    // Observação: não precisamos “normalizar” aqui.
    // Já garantimos que o destino sempre cai dentro de B antes da animação começar.
  }

  /* =================== touch =================== */
  _onTouchStart(e) {
    if (this.isAnimating) return;
    this._isSwiping = true;
    this._touchStartX = e.touches[0].clientX;
    this._touchCurX = this._touchStartX;
  }
  _onTouchMove(e) {
    if (!this._isSwiping || this.isAnimating) return;
    this._touchCurX = e.touches[0].clientX;
  }
  _onTouchEnd() {
    if (!this._isSwiping || this.isAnimating) return;
    const dx = this._touchCurX - this._touchStartX;
    const TH = 50;
    if (dx > TH) this._prev();
    else if (dx < -TH) this._next();
    this._isSwiping = false;
  }

  /* =================== resize =================== */
  _onResize() {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      const wasAnimating = this.isAnimating;
      this._updateStep();
      if (!wasAnimating) {
        // Reposiciona exatamente no item atual, sem animação
        this._setTransform(this.currentIndex, false);
      }
    }, 80);
  }

  /* =================== util =================== */
  destroy() {
    this._stopAutoplay();
    if (this.nextBtn) this.nextBtn.removeEventListener('click', this._next);
    if (this.prevBtn) this.prevBtn.removeEventListener('click', this._prev);
    window.removeEventListener('resize', this._onResize);
    this.wrapper.removeEventListener('transitionend', this._onTransitionEnd);

    this.wrapper.removeEventListener('touchstart', this._onTouchStart);
    this.wrapper.removeEventListener('touchmove', this._onTouchMove);
    this.wrapper.removeEventListener('touchend', this._onTouchEnd);
  }
}
