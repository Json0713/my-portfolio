// assets/js/common/smartInstallPanel.js

import {
  clearDeferredPrompt,
  isStandaloneMode,
  shouldShowPanel,
  setPanelVisible,
  isPanelVisible,
  restorePanelState,
  autoClosePanel,
  cancelAutoClose,
  setupInstallState,
  isPromptAvailable,
  isOnline,
} from './installState.js';

import { showToast } from './toast.js';

let dragStartX = 0;

export function setupSmartInstallUI() {
  if (isStandaloneMode() || !shouldShowPanel()) return;

  setupInstallState((deferredPrompt) => {
    if (!document.getElementById('smart-panel')) {
      createInstallUI(deferredPrompt);
    }
  });
}

function createInstallUI(deferredPrompt) {
  const container = document.createElement('div');
  container.id = 'smart-panel';
  container.className = 'install-panel';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-labelledby', 'panel-title');
  container.setAttribute('aria-modal', 'true');

  container.innerHTML = `
    <div id="panel-header" class="install-header">
      <strong id="panel-title">Install this app</strong>
      <button id="panel-close" class="install-close" aria-label="Close">&times;</button>
    </div>
    <div id="panel-actions">
      <button id="install-btn" class="btn btn-sm btn-success">Install</button>
      <button id="retry-btn" class="btn btn-sm btn-secondary hidden">Try Again</button>
    </div>
    <div id="progress-container" class="progress-wrapper hidden" aria-live="polite">
      <div class="progress">
        <div id="progress-bar" class="progress-bar"></div>
      </div>
      <div id="progress-status" class="progress-status"></div>
    </div>
  `;

  const handle = document.createElement('div');
  handle.id = 'panel-handle';
  handle.className = 'install-handle';
  handle.innerHTML = `<i class="bi bi-chevron-double-right"></i>`;

  document.body.appendChild(container);
  document.body.appendChild(handle);

  restorePanelState(container);

  handle.addEventListener('click', () => togglePanel(container));
  handle.addEventListener('touchstart', (e) => (dragStartX = e.touches[0].clientX));
  handle.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - dragStartX;
    if (dx > 40) togglePanel(container);
  });

  document.getElementById('panel-close')?.addEventListener('click', () => {
    container.classList.remove('visible');
    setPanelVisible(false);
  });

  const installBtn = document.getElementById('install-btn');
  const retryBtn = document.getElementById('retry-btn');
  const progressWrap = document.getElementById('progress-container');
  const bar = document.getElementById('progress-bar');
  const status = document.getElementById('progress-status');

  async function triggerInstall() {
    if (!isOnline()) {
      showToast("<i class='bi bi-wifi-off'></i> You are offline. Please connect to the internet and try again.", {
        type: 'warning'
      });
      return;
    }

    installBtn.disabled = true;
    status.textContent = 'Confirm in the browser popup...';

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      progressWrap.classList.remove('hidden');
      status.textContent = 'Installing... Please wait';
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 4, 99);
        bar.style.width = `${progress}%`;
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        bar.style.width = '100%';
        status.textContent = 'Installation successful!';
        setTimeout(() => {
          container.remove();
          handle.remove();
        }, 3000);
      }, 3000);
    } else {
      container.classList.remove('visible');
      setPanelVisible(false);
      retryBtn.classList.remove('hidden');
      installBtn.classList.add('hidden');
      installBtn.disabled = false;
      progressWrap.classList.add('hidden');
      bar.style.width = '0%';
      status.textContent = 'Installation dismissed. Please retry.';
    }

    clearDeferredPrompt();
  }

  installBtn?.addEventListener('click', triggerInstall);

  retryBtn?.addEventListener('click', () => {
    window.location.reload();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      container.classList.remove('visible');
      setPanelVisible(false);
    }
  });
}

function togglePanel(panel) {
  if (isPanelVisible()) {
    panel.classList.remove('visible');
    setPanelVisible(false);
    cancelAutoClose();
  } else {
    panel.classList.add('visible');
    setPanelVisible(true);
    autoClosePanel(() => {
      panel.classList.remove('visible');
    });
  }
}
