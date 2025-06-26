// assets/js/common/installPrompt.js

import { showToast } from './toast.js';

let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar
    e.preventDefault();
    deferredPrompt = e;

    showInstallBanner();
  });
}

function showInstallBanner() {
  if (!deferredPrompt) return;

  showToast(`
    <div>
      <strong>Install This App</strong>
      <button class="btn btn-success btn-sm ms-2" id="install-btn">
        <i class="bi bi-download"></i> Install
      </button>
    </div>
  `, { type: 'info', duration: 10000 });

  setTimeout(() => {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('✅ App installed');
        } else {
          console.log('❌ App install dismissed');
        }
        deferredPrompt = null;
      });
    }
  }, 200);
}
