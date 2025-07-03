// assets/js/main.js
import { registerServiceWorker } from './common/swRegister.js';

import { initTheme, setupThemeToggle } from './public/theme.js';
import { setupInstallPrompt } from './common/installPrompt.js';

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
  setupInstallPrompt();
  registerServiceWorker();
});
