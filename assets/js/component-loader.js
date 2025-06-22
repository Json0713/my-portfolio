// assets/js/component-loader.js

import { sanitizeHTML } from "./security/sanitizer.js";

const app = document.getElementById("app");
let componentRenderTimeout = null;

function loadComponent(name) {
  const cached = sessionStorage.getItem(`component:${name}`);
  showSkeleton();

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
      show404(name);
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
    loadComponentScript(name);
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

function showSkeleton() {
  app.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-accent" role="status"></div>
      <p class="mt-3">Loading content...</p>
    </div>
  `;
}

function show404(name) {
  document.title = `Page Not Found | Jason B.`;
  app.innerHTML = `
    <div class="coming-soon text-center d-flex flex-column justify-content-center align-items-center p-4" style="min-height: 70vh;">
      <i class="bi bi-cone-striped" style="font-size: 4rem; color: var(--text-accent);"></i>
      <h1 class="display-6 fw-bold mt-3">404 Page Not Found!</h1>
      <p class="lead">This page does not yet Exist, or this page still Under Development!</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a href="https://my-portfolio-fawn-six-spddunmlyp.vercel.app/#hero" target="_blank" aria-label="Coffee">
          <i class="bi bi-cup-hot-fill" style="font-size: 1.75rem; color: var(--accent);"></i>
        </a>
        <a href="https://github.com/Json0713/my-portfolio" target="_blank" aria-label="GitHub">
          <i class="bi bi-github" style="font-size: 1.75rem; color: var(--accent);" data-placement="top" title="Github!"></i>
        </a>
      </div>
    </div>
  `;
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
}

window.addEventListener("DOMContentLoaded", initRouter);
