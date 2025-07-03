// assets/js/main.js

import { registerServiceWorker } from './common/swRegister.js';

// existing imports
import { initTheme, setupThemeToggle } from './public/theme.js';
import { highlightActiveLink } from './routes/routerLink.js';
import { setupInstallPrompt } from './common/installPrompt.js';

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
  highlightActiveLink();
  setupInstallPrompt();
  registerServiceWorker();
});
