// src/main.js — Single entry point for Vite

// Vendor CSS (processed and bundled by Vite)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// App CSS
import './css/style.css';
import './css/hero.css';
import './css/pages.css';
import './css/smart-install.css';

// Bootstrap JS (needed for dropdowns, modals, etc.)
import 'bootstrap';

// App modules
import { initRouter } from './js/router.js';
import { initTheme, setupThemeToggle } from './js/public/theme.js';
import { registerServiceWorker } from './js/common/swRegister.js';
import { setupInstallPrompt } from './js/common/installPrompt.js';
import { initCyberBackground } from './js/public/cyberBg.js';
import { initHeaderBehavior } from './js/public/headerBehavior.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme first (prevents flash of wrong theme)
  initTheme();
  setupThemeToggle();

  // Initialize Cyber Background
  initCyberBackground();

  // Initialize Header Behavior
  initHeaderBehavior();

  // SPA router
  initRouter();

  // PWA features
  setupInstallPrompt();
  registerServiceWorker();

  // Dynamic footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
