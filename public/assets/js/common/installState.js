// assets/js/common/installState.js

let deferredPrompt = null;
let panelVisible = false;
let autoCloseTimeout = null;
let promptAvailable = false;

const LOCAL_KEY = 'smartPanel:visible';
const DISMISS_KEY = 'smartPanel:dismissed';

let onDeferredPromptReady = null;

export function setupInstallState(callback) {
  onDeferredPromptReady = callback;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    promptAvailable = true;

    if (typeof onDeferredPromptReady === 'function') {
      onDeferredPromptReady(deferredPrompt);
    }
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
  promptAvailable = false;
}

export function isPromptAvailable() {
  return promptAvailable && deferredPrompt !== null;
}

export function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export function shouldShowPanel() {
  return localStorage.getItem(DISMISS_KEY) !== 'true';
}

export function markPanelDismissed() {
  localStorage.setItem(DISMISS_KEY, 'true');
}

export function isPanelVisible() {
  return panelVisible;
}

export function setPanelVisible(state) {
  panelVisible = state;
  localStorage.setItem(LOCAL_KEY, String(state));
}

export function restorePanelState(panelEl) {
  const state = localStorage.getItem(LOCAL_KEY);
  if (state === 'true') {
    panelVisible = true;
    panelEl.classList.add('visible');
  }
}

export function autoClosePanel(callback, delay = 45000) {
  clearTimeout(autoCloseTimeout);
  autoCloseTimeout = setTimeout(() => {
    panelVisible = false;
    localStorage.setItem(LOCAL_KEY, 'false');
    callback();
  }, delay);
}

export function cancelAutoClose() {
  clearTimeout(autoCloseTimeout);
}

export function isOnline() {
  return navigator.onLine;
}
