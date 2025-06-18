// assets/js/component-loader.js
function loadComponent(name) {
  fetch(`src/pages/${name}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Page not found: ${name}`);
      return res.text();
    })
    .then(html => {
      const app = document.getElementById("app");
      app.style.opacity = 0;
      setTimeout(() => {
        app.innerHTML = html;
        app.style.opacity = 1;
        loadScript(`assets/js/${name}.js`);
      }, 200);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("app").innerHTML = `<p>Component \\"${name}\\" not found.</p>`;
    });
}

function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}

function initRouter() {
  const defaultPage = "hero";
  const hash = window.location.hash.slice(1) || defaultPage;
  loadComponent(hash);

  window.addEventListener("hashchange", () => {
    const page = window.location.hash.slice(1);
    loadComponent(page);
  });
}

window.addEventListener("DOMContentLoaded", initRouter);
