export function setupSlideTrigger() {
  const ctn = document.querySelector('.slide');
  const slide = document.querySelector('.slide-placeholder');
  const slideContainer = document.querySelector('.slider .listSlides');
  const seta = document.querySelector('.seta');

  if (!ctn || !slide || !slideContainer) return;

  const totalSlides = slideContainer.children.length;

  let slideHeight = window.innerHeight * 3; // 200vh para o efeito
  let startOffset = slide.offsetTop;
  let endOffset = startOffset + slideHeight;
  let scrollListenerAttached = false;

  function updateDimensions() {
    slideHeight = window.innerHeight * 2;
    startOffset = slide.offsetTop;
    endOffset = startOffset + slideHeight;
  }

  window.addEventListener('resize', updateDimensions);

  const observer0 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ctn.style.transition = '0'
        ctn.style.position = 'fixed';
        ctn.style.top = '0';
        ctn.style.left = '0';
        slide.style.height = '300vh';
        if (!scrollListenerAttached) {
          slideMotor();
          scrollListenerAttached = true;
        }
      }
    });
  }, {
    rootMargin: '0px 0px -100% 0px',
    threshold: 0
  });

  observer0.observe(ctn);

  function slideMotor() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      const currentStart = startOffset;
      const currentEnd = endOffset;

      if (scrollY >= currentStart && scrollY <= currentEnd) {
        const effectiveHeight = slideHeight;
        const progress = Math.min((scrollY - currentStart) / effectiveHeight, 1);
        const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easeOutCubic = t => (--t) * t * t + 1;
        const easedProgress = easeInOut(progress);

        const maxTranslate = (totalSlides - 1) * 100;
        const translateXValue = easedProgress * maxTranslate;

        slideContainer.style.transform = `translateX(-${translateXValue}vw)`;

        ctn.style.position = 'fixed';
        ctn.style.top = '0';
        ctn.style.left = '0';
      } else if (scrollY > currentEnd) {
        slideContainer.style.transform = `translateX(-${(totalSlides - 1) * 100}vw)`;
        slide.style.alignItems = 'end';
        ctn.style.position = 'relative';
      } else if (scrollY < currentStart) {
        slideContainer.style.transform = `translateX(0vw)`;
        slide.style.alignItems = 'start';
        ctn.style.position = 'relative';
      }
    });
  }

  // Inicializa dimensões no carregamento
  updateDimensions();
}
