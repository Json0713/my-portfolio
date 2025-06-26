// assets/js/response/offline.js
import { showToast } from "../common/toast.js";

export function showOffline(name) {
  document.title = `Offline Mode | Jason B.`;
  const app = document.getElementById("app");

  if (!sessionStorage.getItem("toast:offline")) {
    showToast("<i class='bi bi-wifi-off'></i> You are currently offline. Some features may be unavailable.", {
      type: "warning"
    });
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
