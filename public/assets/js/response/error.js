// assets/js/response/error.js
import { showToast } from "../common/toast.js";

export function show404(name) {
  document.title = `Page Not Found | Jason B.`;
  const app = document.getElementById("app");
  
  if (!sessionStorage.getItem("toast:404")) {
    showToast("<i class='bi bi-exclamation-triangle-fill'></i> This page doesn't exist or is under development.", {
      type: "danger"
    });
    sessionStorage.setItem("toast:404", "shown");
  }
  
  app.innerHTML = `
    <div class="coming-soon text-center d-flex flex-column justify-content-center align-items-center p-4" style="min-height: 70vh;">
      <i class="bi bi-cone-striped" style="font-size: 4rem; color: var(--text-gray);"></i>
      <h1 class="display-6 fw-bold mt-3">404 Page Not Found!</h1>
      <p class="lead">This page does not yet Exist, or this page still Under Development!</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a href="https://github.com/Json0713/Json0713" target="_blank" aria-label="Coffee">
          <i class="bi bi-cup-hot-fill" style="font-size: 1.75rem; color: var(--gray);"></i>
        </a>
        <a href="https://github.com/Json0713/my-portfolio" target="_blank" aria-label="GitHub">
          <i class="bi bi-github" style="font-size: 1.75rem; color: var(--gray);" title="GitHub"></i>
        </a>
      </div>
    </div>
  `;
}
