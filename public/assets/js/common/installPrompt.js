// assets/js/common/installPrompt.js

let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallModal();
  });
}

function showInstallModal() {
  if (document.getElementById('install-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'install-modal';
  modal.style.position = 'fixed';
  modal.style.bottom = '1rem';
  modal.style.left = '50%';
  modal.style.transform = 'translateX(-50%)';
  modal.style.background = 'var(--bs-dark)';
  modal.style.color = 'white';
  modal.style.padding = '1rem';
  modal.style.borderRadius = '0.5rem';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  modal.style.zIndex = 1000;
  modal.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
      <strong>Install this app?</strong>
      <div style="display:flex;gap:0.5rem;">
        <button id="install-now" class="btn btn-sm btn-success">Install</button>
        <button id="dismiss-install" class="btn btn-sm btn-secondary">Later</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('install-now')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install: ${outcome}`);
    deferredPrompt = null;
    modal.remove();
  });

  document.getElementById('dismiss-install')?.addEventListener('click', () => {
    modal.remove();
    deferredPrompt = null;
  });
}
