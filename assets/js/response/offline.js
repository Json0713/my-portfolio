// assets/js/response/offline.js

export function showOffline(name) {
  document.title = `Offline Mode | Jason B.`;
  const app = document.getElementById("app");

  if (!sessionStorage.getItem("toast:offline")) {
    showToast("<i class='bi bi-wifi-off'></i> You are currently offline. Some features may be unavailable.");
    sessionStorage.setItem("toast:offline", "shown");
  }

  app.innerHTML = `
    <div class="offline-mode text-center d-flex flex-column justify-content-center align-items-center p-4" style="min-height: 70vh;">
      <i class="bi bi-wifi-off" style="font-size: 4rem; color: var(--text-gray);"></i>
      <h1 class="display-6 fw-bold mt-3">Offline Mode</h1>
      <p class="lead">It looks like you're not connected to the internet. Please check your connection.</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a href="#" onclick="location.reload()" aria-label="Retry">
          <i class="bi bi-arrow-clockwise" style="font-size: 1.75rem; color: var(--gray);"></i>
        </a>
        <a href="https://github.com/Json0713/my-portfolio" target="_blank" aria-label="GitHub">
          <i class="bi bi-github" style="font-size: 1.75rem; color: var(--gray);"></i>
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
