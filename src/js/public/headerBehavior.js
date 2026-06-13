// src/js/public/headerBehavior.js

export function initHeaderBehavior() {
  const wrapper = document.getElementById('header-wrapper');
  const siteHeader = document.getElementById('site-header');

  if (!wrapper || !siteHeader) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const headerHeight = siteHeader.offsetHeight;

    // If scrolling down and we scrolled past the header height, hide it
    if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
      wrapper.style.top = `-${headerHeight}px`;
    } 
    // If scrolling up, show it
    else if (currentScrollY < lastScrollY) {
      wrapper.style.top = '0px';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}
