// assets/js/response/error.js

export function show404(name) {
  document.title = `Page Not Found | Jason B.`;
  const app = document.getElementById("app");
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
          <i class="bi bi-github" style="font-size: 1.75rem; color: var(--accent);" title="GitHub"></i>
        </a>
      </div>
    </div>
  `;
}
