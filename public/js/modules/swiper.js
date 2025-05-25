import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export function InitSwiper({
  swiperClass = '.swiper',
  hoverClass = '.hover',
  direcao = 'left',
  velocidade = 30,
} = {}) {
  const direction = direcao.toLowerCase();
  const container = document.querySelector(swiperClass);

  const swiper = new Swiper(swiperClass, {
    slidesPerView: 'auto',
    spaceBetween: 30,
    loop: false,
    allowTouchMove: false,
  });

  const wrapper = swiper.wrapperEl;
  const originalSlides = [...swiper.slides];

  let totalWidth;
  let pos;
  let currentSpeed = velocidade;
  let targetSpeed = velocidade;

  let animationFrame;
  let lastTime = null;

  const observer = new ResizeObserver(() => {
    recalculate();
  });

  /** 🔥 Função que remove clones e recalcula dimensões */
  function recalculate() {
    // Remove clones existentes
    const clones = wrapper.querySelectorAll('.swiper-slide-duplicate');
    clones.forEach(clone => clone.remove());

    // Faz os clones novamente
    for (let i = 0; i < 2; i++) {
      originalSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('swiper-slide-duplicate');
        wrapper.appendChild(clone);
      });
    }

    // 🔥 Recalcula o totalWidth baseado no novo tamanho
    totalWidth = getTotalSlidesWidth(wrapper.children) / 3;

    // Ajusta a posição para não pular
    pos = direction === 'left' ? 0 : -totalWidth;
  }

  /** 🔁 Loop de animação */
  function loop(time) {
    if (lastTime === null) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    currentSpeed += (targetSpeed - currentSpeed) * 0.1;
    const move = (currentSpeed * delta) / 1000;
    const deltaMove = direction === 'left' ? -move : move;

    pos += deltaMove;

    if (direction === 'left') {
      if (pos <= -totalWidth) pos += totalWidth;
    } else {
      if (pos >= 0) pos -= totalWidth;
    }

    wrapper.style.transform = `translate3d(${pos}px, 0, 0)`;

    animationFrame = requestAnimationFrame(loop);
  }

  /** 🚀 Inicia tudo */
  recalculate();
  animationFrame = requestAnimationFrame(loop);

  /** 🖥️ Começa a observar mudanças de tamanho */
  originalSlides.forEach(slide => observer.observe(slide));

  /** 🎯 Hover e touch pausam */
  const hoverElements = container.querySelectorAll(hoverClass);

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      targetSpeed = 0;
      el.classList.add('ativo');
    });
    el.addEventListener('mouseleave', () => {
      targetSpeed = velocidade;
      el.classList.remove('ativo');
    });
    el.addEventListener('touchstart', () => {
      targetSpeed = 0;
      el.classList.add('ativo');
    }, { passive: true });
    el.addEventListener('touchend', () => {
      targetSpeed = velocidade;
      el.classList.remove('ativo');
    });
    el.addEventListener('touchcancel', () => {
      targetSpeed = velocidade;
      el.classList.remove('ativo');
    });
  });

  /** 🎛️ API pública */
  return {
    pause: () => targetSpeed = 0,
    resume: () => targetSpeed = velocidade,
    destroy: () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    },
    recalculate,
  };
}


/** ✅ Utilitário robusto */
function getTotalSlidesWidth(slides) {
  let total = 0;
  for (const slide of slides) {
    const style = getComputedStyle(slide);
    const width = slide.offsetWidth;
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    total += width + marginLeft + marginRight;
  }
  return total;
}
