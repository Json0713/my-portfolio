// assets/js/component-loader.js

function loadComponent(name) {
  const app = document.getElementById("app");
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
      sessionStorage.setItem(`component:${name}`, html);
      renderComponent(html, name);
    })
    .catch(err => {
      console.error(err);
      app.innerHTML = `<div class="alert alert-warning rounded-4">Component "${name}" not found.</div>`;
    });
}

function renderComponent(html, name) {
  const app = document.getElementById("app");

  app.classList.remove("fade-in");
  app.classList.add("fade-out");

  setTimeout(() => {
    app.innerHTML = html;
    app.classList.remove("fade-out");
    app.classList.add("fade-in");
    loadScript(`assets/js/${name}.js`);
  }, 200);
}

function loadScript(src) {
  // Remove previous component script if exists
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}

function showSkeleton() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-accent" role="status"></div>
      <p class="mt-3">Loading content...</p>
    </div>
  `;
}

function getCurrentHashRoute() {
  const raw = window.location.hash.slice(1).trim().toLowerCase();
  return raw || "hero";
}

function initRouter() {
  loadComponent(getCurrentHashRoute());

  window.addEventListener("hashchange", () => {
    loadComponent(getCurrentHashRoute());
  });
}

window.addEventListener("DOMContentLoaded", initRouter);
