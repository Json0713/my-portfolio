// src/js/utils/animations.js — Shared page animation utility

/**
 * Initialize IntersectionObserver-based reveal animations.
 * Call after any page content is rendered into the DOM.
 */
export function initPageAnimations() {
  const animatedEls = document.querySelectorAll('[class*="animate-"]');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedEls.forEach((el) => {
    if (!el.classList.contains('animate-in')) {
      observer.observe(el);
    }
  });
}
