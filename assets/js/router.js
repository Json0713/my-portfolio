// assets/js/router.js

import { sanitizeHTML } from "./security/sanitizer.js";
import { show404 } from "./response/error.js";
import { showOffline } from "./response/offline.js";
import { showSpinner, hideSpinner } from "./common/loader.js";

const app = document.getElementById("app");
let componentRenderTimeout = null;

function loadComponent(name) {
  const cached = sessionStorage.getItem(`component:${name}`);
  showSpinner(app);

  if (cached) {
    renderComponent(cached, name);
    return;
  }

  fetch(`src/pages/${name}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Page not found: ${name}`);
      return res.text();
    })
    .then(html => {
      const cleanHTML = sanitizeHTML(html);
      sessionStorage.setItem(`component:${name}`, cleanHTML);
      renderComponent(cleanHTML, name);
    })
    .catch(err => {
      console.error(err);
      if (!navigator.onLine) {
        showOffline(name);
      } else {
        show404(name);
      }
    });
}

function renderComponent(html, name) {
  clearTimeout(componentRenderTimeout);

  app.classList.remove("fade-in");
  app.classList.add("fade-out");

  componentRenderTimeout = setTimeout(() => {
    app.innerHTML = html;
    app.classList.remove("fade-out");
    app.classList.add("fade-in");
    app.setAttribute("aria-label", `${capitalize(name)} Page`);
    updatePageTitle(name);
    sessionStorage.removeItem("toast:404");
    loadComponentScript(name);
    hideSpinner();
  }, 200);
}

function loadComponentScript(name) {
  const src = `assets/js/${name}.js`;

  fetch(src, { method: "HEAD" })
    .then(res => {
      if (!res.ok) return;
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) existing.remove();

      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(console.warn);
}

function updatePageTitle(name) {
  const titleMap = {
    hero: "Home",
    about: "About",
    projects: "Projects",
    contact: "Contact"
  };
  const title = titleMap[name] || capitalize(name);
  document.title = `${title} | Jason B.`;
}

function getCurrentHashRoute() {
  const raw = window.location.hash.slice(1).trim().toLowerCase();
  return raw || "hero";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function initRouter() {
  loadComponent(getCurrentHashRoute());

  window.addEventListener("hashchange", () => {
    loadComponent(getCurrentHashRoute());
  });

  // Toast on network changes
  window.addEventListener("online", () => {
    showToast("<i class='bi bi-wifi'></i> You are back online.");
    sessionStorage.removeItem("toast:offline");
  });

  window.addEventListener("offline", () => {
    showToast("<i class='bi bi-wifi-off'></i> You are offline.");
  });
}

window.addEventListener("DOMContentLoaded", initRouter);

// Toast reuse
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.style.cssText = `
    position: fixed;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-dark);
    color: var(--silver);
    border-left: 4px solid var(--accent);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    z-index: 2000;
    width: 85vw;
    font-weight: 600;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease, transform 0.3s ease;
  `;
  toast.innerHTML = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.pointerEvents = "auto";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
} 
