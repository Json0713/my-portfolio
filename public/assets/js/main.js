// assets/js/main.js

import { initTheme, setupThemeToggle } from './public/theme.js';
import { highlightActiveLink } from './routes/routerLink.js';
import { setupInstallPrompt } from './common/installPrompt.js';

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
  highlightActiveLink();
  setupInstallPrompt();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
});
