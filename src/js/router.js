// src/js/router.js
import { sanitizeHTML } from './security/sanitizer.js';
import { show404 } from './response/error.js';
import { showOffline } from './response/offline.js';
import { showSpinner, hideSpinner } from './common/loader.js';
import { showToast } from './common/toast.js';
import { highlightActiveLink } from './routes/routerLink.js';
import { $, capitalize } from './utils/utils.js';
import { initPageAnimations } from './utils/animations.js';

// Vite-powered dynamic imports for page-specific scripts
const pageModules = import.meta.glob('./pages/*.js');

const app = $('#app');
let componentRenderTimeout = null;

// Cache version — increment on deploy to purge stale sessionStorage entries
const CACHE_VERSION = '2.0.0';
(function clearStaleCache() {
  if (sessionStorage.getItem('cache:version') !== CACHE_VERSION) {
    // Remove all cached page fragments from previous versions
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('component:')) sessionStorage.removeItem(key);
    });
    sessionStorage.setItem('cache:version', CACHE_VERSION);
  }
})();

function getCurrentRoute() {
  const hash = window.location.hash.slice(1).trim().toLowerCase();
  return hash || 'hero';
}

function updatePageTitle(name) {
  const titleMap = {
    hero: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    resume: 'Resume',
  };
  const title = titleMap[name] || capitalize(name);
  document.title = `${title} | Jason B.`;
}

async function loadComponentScript(name) {
  const path = `./pages/${name}.js`;
  if (pageModules[path]) {
    try {
      const module = await pageModules[path]();
      if (typeof module.init === 'function') {
        requestAnimationFrame(() => module.init());
      }
    } catch (err) {
      console.warn(`Page script error for "${name}":`, err);
    }
  }
}

function renderComponent(html, name) {
  clearTimeout(componentRenderTimeout);

  app.classList.remove('fade-in');
  app.classList.add('fade-out');

  componentRenderTimeout = setTimeout(() => {
    app.innerHTML = html;
    app.classList.remove('fade-out');
    app.classList.add('fade-in');
    app.setAttribute('aria-label', `${capitalize(name)} Page`);

    // Smoothly scroll to the top of the page on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updatePageTitle(name);
    highlightActiveLink();
    sessionStorage.removeItem('toast:404');

    // Auto-init animations for all pages
    initPageAnimations();

    // Load page-specific script (hero typing, contact form, etc.)
    loadComponentScript(name);

    hideSpinner();
  }, 200);
}

function loadComponent(name) {
  const cached = sessionStorage.getItem(`component:${name}`);
  showSpinner();

  if (cached) {
    renderComponent(cached, name);
    return;
  }

  fetch(`pages/${name}.html`)
    .then((res) => {
      if (!res.ok) throw new Error(`Page not found: ${name}`);
      return res.text();
    })
    .then((html) => {
      const cleanHTML = sanitizeHTML(html);
      sessionStorage.setItem(`component:${name}`, cleanHTML);
      renderComponent(cleanHTML, name);
    })
    .catch((err) => {
      console.error('Router fetch error:', err);
      if (!navigator.onLine) {
        showOffline(name);
      } else {
        show404(name);
      }
    });
}

export function initRouter() {
  loadComponent(getCurrentRoute());

  window.addEventListener('hashchange', () => {
    loadComponent(getCurrentRoute());
  });

  window.addEventListener('online', () => {
    showToast("<i class='bi bi-wifi'></i> You are back online.", { type: 'info' });
    sessionStorage.removeItem('toast:offline');
  });

  window.addEventListener('offline', () => {
    showToast("<i class='bi bi-wifi-off'></i> You are offline.", { type: 'info' });
  });
}
