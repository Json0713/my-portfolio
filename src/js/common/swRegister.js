// src/js/common/swRegister.js
import { showToast } from './toast.js';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          console.log('Service Worker registered:', reg.scope);
          // Periodically check for updates (e.g. every hour)
          setInterval(() => reg.update(), 60 * 60 * 1000);
        })
        .catch((err) => console.error('SW registration failed:', err));

      // Listen for the service worker taking control (update installed & activated)
      let isUpdating = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isUpdating) {
          isUpdating = true;
          handleAppUpdate();
        }
      });

      // Request OS notification permission gracefully on first user interaction
      // to avoid being blocked by the browser for unprompted requests.
      if ('Notification' in window && Notification.permission === 'default') {
        const requestPermission = () => {
          Notification.requestPermission();
          document.removeEventListener('click', requestPermission);
        };
        document.addEventListener('click', requestPermission, { once: true });
      }
    });
  }
}

function handleAppUpdate() {
  const title = 'Portfolio Updated';
  const msg = 'The site has been updated. You are now on the latest version.';

  // 1. Show OS-Level Notification (or fallback to toast)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: msg,
      icon: '/favicon/favicon-96x96.png',
    });
  } else {
    showToast(`<i class='bi bi-info-circle-fill'></i> ${msg}`, { type: 'info', duration: 6000 });
  }

  // 2. Update app in-place without refreshing the page
  // Clear SPA component cache
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('component:')) {
      sessionStorage.removeItem(key);
    }
  });

  // Trigger router to re-fetch and render the fresh HTML fragment for the current view
  window.dispatchEvent(new Event('hashchange'));
}
