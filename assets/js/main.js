// assets/js/main.js

import { initTheme, setupThemeToggle } from './public/theme.js';
import { highlightActiveLink } from './routes/routerLink.js';

// Initialize theme and setup listeners on load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();

  // Initial nav highlight
  highlightActiveLink();
});
