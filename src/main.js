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
import { initBackgroundRenderer } from './js/public/backgroundRenderer.js';
import { initHeaderBehavior } from './js/public/headerBehavior.js';
import { initCustomizer } from './js/public/customizer.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme first (prevents flash of wrong theme)
  initTheme();
  setupThemeToggle();

  // Initialize the correct background on load based on settings
  const settings = JSON.parse(localStorage.getItem('siteCustomizerSettings') || '{}');
  initBackgroundRenderer(settings.bgType || 'cyber');

  // Initialize Header Behavior
  initHeaderBehavior();

  // Initialize Site Customizer
  initCustomizer();

  // SPA router
  initRouter();

  // PWA features
  setupInstallPrompt();
  registerServiceWorker();

  // Dynamic footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
