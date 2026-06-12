// src/js/common/installPrompt.js

import { setupSmartInstallUI } from './smartInstallPanel.js';
import { setupInstallState } from './installState.js';

export function setupInstallPrompt() {
  // Initialize shared state and install logic
  setupInstallState();

  // Initialize install UI panel
  setupSmartInstallUI();
}
