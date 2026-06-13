// src/js/utils/animations.js — Shared page animation utility

let currentObserver = null;

/**
 * Initialize IntersectionObserver-based reveal animations.
 * Call after any page content is rendered into the DOM.
 */
export function initPageAnimations() {
  // Disconnect the previous observer to prevent memory leaks on route changes
  if (currentObserver) {
    currentObserver.disconnect();
  }

  const animatedEls = document.querySelectorAll('[class*="animate-"]');
  
  currentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Toggle the animation class based on whether it is currently in the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          entry.target.classList.remove('animate-in');
        }
      });
    },
    { 
      // 10% of the element needs to be visible to trigger
      threshold: 0.1,
      // Optional: triggers slightly before element hits the very edge
      rootMargin: "0px 0px -50px 0px" 
    }
  );

  animatedEls.forEach((el) => {
    currentObserver.observe(el);
  });
}
