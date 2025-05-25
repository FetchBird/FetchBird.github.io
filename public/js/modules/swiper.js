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

  function recalculate() {
    const clones = wrapper.querySelectorAll('.swiper-slide-duplicate');
    clones.forEach(clone => clone.remove());

    for (let i = 0; i < 2; i++) {
      originalSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('swiper-slide-duplicate');
        wrapper.appendChild(clone);
      });
    }

    totalWidth = getTotalSlidesWidth(wrapper.children) / 3;
    pos = direction === 'left' ? 0 : -totalWidth;
  }

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

  recalculate();
  animationFrame = requestAnimationFrame(loop);

  originalSlides.forEach(slide => observer.observe(slide));

  /** 🎯 Hover exclusivo no desktop + Toggle via click no mobile e desktop */
  addExclusiveHoverAndClick(container, hoverClass,
    (el) => {
      targetSpeed = 0;
      el.classList.add('ativo');
    },
    (el) => {
      targetSpeed = velocidade;
      el.classList.remove('ativo');
    }
  );

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


/** ✅ Calcula a largura dos slides */
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


/** ✅ Hover exclusivo + Clique exclusivo */
function addExclusiveHoverAndClick(container, selector, onEnter, onLeave) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const getActive = () => container.querySelector(`${selector}.ativo`);

  if (!isTouchDevice) {
    // Desktop hover
    container.addEventListener('mouseenter', e => {
      const target = e.target.closest(selector);
      if (target) {
        const active = getActive();
        if (active && active !== target) {
          onLeave(active);
        }
        onEnter(target);
      }
    }, true);

    container.addEventListener('mouseleave', e => {
      const target = e.target.closest(selector);
      if (target) {
        onLeave(target);
      }
    }, true);
  }

  // Clique funciona tanto no desktop quanto no mobile
  container.addEventListener('click', e => {
    const target = e.target.closest(selector);
    if (!target) return;

    const active = getActive();

    if (active && active === target) {
      // Se clicou no mesmo, desativa
      onLeave(target);
    } else {
      // Se clicou em outro, desativa o anterior e ativa o novo
      if (active) onLeave(active);
      onEnter(target);
    }
  }, { passive: true });
}
