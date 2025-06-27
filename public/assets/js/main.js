// assets/js/main.js

import { initTheme, setupThemeToggle } from './public/theme.js';
import { highlightActiveLink } from './routes/routerLink.js';
import { setupInstallPrompt, setupUpdatePrompt } from './common/installPrompt.js';

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
  highlightActiveLink();
  setupInstallPrompt();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
          console.log('Service Worker registered:', reg.scope);

          if (reg.waiting) {
            setupUpdatePrompt(reg);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setupUpdatePrompt(reg);
                }
              });
            }
          });

          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'NEW_VERSION_AVAILABLE') {
              setupUpdatePrompt(reg);
            }
          });
        })
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
});
