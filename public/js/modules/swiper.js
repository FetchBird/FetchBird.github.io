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
  const slides = [...swiper.slides];

  // ✅ Cria 2 cópias (total de 3 blocos de slides)
  for (let i = 0; i < 2; i++) {
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('swiper-slide-duplicate');
      wrapper.appendChild(clone);
    });
  }

  const totalWidth = getTotalSlidesWidth(wrapper.children) / 3;
  let pos = direction === 'left' ? 0 : -totalWidth;
  let currentSpeed = velocidade;
  let targetSpeed = velocidade;

  let animationFrame;
  let lastTime = null;

  function loop(time) {
    if (lastTime === null) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;

    currentSpeed += (targetSpeed - currentSpeed) * 0.1;

    const move = (currentSpeed * delta) / 1000;
    const deltaMove = direction === 'left' ? -move : move;

    pos += deltaMove;

    // ✅ Loop infinito suave
    if (direction === 'left' && pos <= -totalWidth) {
      pos += totalWidth;
    }
    if (direction === 'right' && pos >= 0) {
      pos -= totalWidth;
    }

    wrapper.style.transform = `translate3d(${pos}px, 0, 0)`;

    animationFrame = requestAnimationFrame(loop);
  }

  animationFrame = requestAnimationFrame(loop);

  // ✅ Controle individual de hover
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
      targetSpeed = 0
      el.classList.add('ativo')
      setTimeout(() => {
        targetSpeed = velocidade
        el.classList.remove('ativo')
      }, 1500)
    }, { passive: true });
   
  });

  return {
    pause: () => targetSpeed = 0,
    resume: () => targetSpeed = velocidade,
    destroy: () => cancelAnimationFrame(animationFrame),
  };
}

function getTotalSlidesWidth(slides) {
  let total = 0;
  for (const slide of slides) {
    const style = getComputedStyle(slide);
    const width = slide.offsetWidth;
    const marginRight = parseFloat(style.marginRight) || 0;
    total += width + marginRight;
  }
  return total;
}
