export function setupSlideTrigger() {
  const slidePlaceholder = document.querySelector('.slide-placeholder');
  const slideSticky = document.querySelector('.slide');
  const slideContainer = document.querySelector('.slider .listSlides');

  if (!slidePlaceholder || !slideSticky || !slideContainer) return;

  const totalSlides = slideContainer.children.length;
  const speedFactor = 1;

  function updateLayout() {
    slidePlaceholder.style.height = `210vh`;
    slideContainer.style.width = `${totalSlides * 100}vw`;
  }

  function onScroll() {
    const rect = slidePlaceholder.getBoundingClientRect();
    const scrollDistance = window.innerHeight * (totalSlides - 1);
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollDistance);
    const progress = scrolled / scrollDistance;
    const rawTranslate = progress * (totalSlides - 1) * 100 * speedFactor;
    const translateX = Math.min(rawTranslate, (totalSlides - 1) * 100); // limita o final
    slideContainer.style.transform = `translateX(-${translateX}vw)`;
  }

  function onResize() {
    updateLayout();
    onScroll();
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
  updateLayout();
  onScroll();

}
