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
  let originalSlides = [...swiper.slides];

  let totalWidth;
  let pos;
  let currentSpeed = velocidade;
  let targetSpeed = velocidade;
  let animationFrame;
  let lastTime = null;

  const observer = new ResizeObserver(() => {
    recalculate();
  });

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

  function refreshSlides() {
    // Remove os clones
    wrapper.querySelectorAll('.swiper-slide-duplicate').forEach(clone => clone.remove());

    // Atualiza os slides originais
    originalSlides = Array.from(wrapper.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'));

    // Reaplica o observer e o hover
    observer.disconnect();
    originalSlides.forEach(slide => observer.observe(slide));

    addHoverListeners(container, hoverClass,
      (el) => {
        targetSpeed = 0;
        el.classList.add('ativo');
      },
      (el) => {
        targetSpeed = velocidade;
        el.classList.remove('ativo');
      }
    );

    // Força estilo resetado (soluciona visual quebrado)
    wrapper.style.transition = 'none';
    wrapper.style.transform = 'translate3d(0, 0, 0)';
    wrapper.offsetHeight; // força repaint

    recalculate(); // recria clones
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

  addHoverListeners(container, hoverClass,
    (el) => {
      targetSpeed = 0;
      el.classList.add('ativo');
    },
    (el) => {
      targetSpeed = velocidade;
      el.classList.remove('ativo');
    }
  );

  refreshSlides(); // inicia com os slides existentes
  animationFrame = requestAnimationFrame(loop);

  return {
    pause: () => targetSpeed = 0,
    resume: () => targetSpeed = velocidade,
    destroy: () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    },
    recalculate,
    refreshSlides, // <- 🧠 essencial para slides dinâmicos
    update: () => swiper.update(), // caso precise do swiper real
  };
}

function addHoverListeners(container, selector, onEnter, onLeave) {
  let currentTarget = null;

  container.addEventListener('mouseover', e => {
    const target = e.target.closest(selector);
    if (target && currentTarget !== target) {
      currentTarget = target;
      container.querySelectorAll(selector).forEach(el => {
        if (el !== target) el.classList.remove('ativo');
      });
      onEnter(target);
    }
  }, true);

  container.addEventListener('mouseout', e => {
    if (!currentTarget) return;
    const related = e.relatedTarget;
    if (!related || !currentTarget.contains(related)) {
      onLeave(currentTarget);
      currentTarget = null;
    }
  }, true);

  container.addEventListener('touchstart', e => {
    const target = e.target.closest(selector);
    if (target) {
      const isActive = target.classList.contains('ativo');
      container.querySelectorAll(selector).forEach(el => el.classList.remove('ativo'));
      if (!isActive) {
        onEnter(target);
      } else {
        onLeave(target);
      }
    }
  }, { passive: true });
}
