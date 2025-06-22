// assets/js/response/error.js

export function show404(name) {
  document.title = `Page Not Found | Jason B.`;
  const app = document.getElementById("app");

  if (!sessionStorage.getItem("toast:404")) {
    showToast("<i class='bi bi-exclamation-triangle-fill' px-></i> This page doesn't exist or is under development.");
    sessionStorage.setItem("toast:404", "shown");
  }

  app.innerHTML = `
    <div class="coming-soon text-center d-flex flex-column justify-content-center align-items-center p-4" style="min-height: 70vh;">
      <i class="bi bi-cone-striped" style="font-size: 4rem; color: var(--text-gray);"></i>
      <h1 class="display-6 fw-bold mt-3">404 Page Not Found!</h1>
      <p class="lead">This page does not yet Exist, or this page still Under Development!</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a href="https://my-portfolio-fawn-six-spddunmlyp.vercel.app/#hero" target="_blank" aria-label="Coffee">
          <i class="bi bi-cup-hot-fill" style="font-size: 1.75rem; color: var(--gray);"></i>
        </a>
        <a href="https://github.com/Json0713/my-portfolio" target="_blank" aria-label="GitHub">
          <i class="bi bi-github" style="font-size: 1.75rem; color: var(--gray);" title="GitHub"></i>
        </a>
      </div>
    </div>
  `;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.style.cssText = `
    position: fixed;
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-dark);
    color: var(--silver);
    border-left: 4px solid var(--accent);
    box-shadow: 0 0 12px rgba(0, 0, 0, 1);
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    z-index: 2000;
    width: 345px;
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
