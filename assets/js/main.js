// assets/js/main.js

import { initTheme, setupThemeToggle } from './public/theme.js';
import { highlightActiveLink } from './routes/routerLink.js';

// Initialize theme and setup listeners on load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();

  // Initial nav highlight
  highlightActiveLink();

  // Register Service Worker (services/service.js)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('services/service.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker error:', err)
        );
    });
  }
});