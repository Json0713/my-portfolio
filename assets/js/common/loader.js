// assets/js/common/loader.js

let isSpinnerVisible = false;

export function showSpinner(delay = 100) {
  if (isSpinnerVisible) return;
  const app = document.getElementById("app");
  if (!app) return;

  const loaderWrapper = document.createElement("div");
  loaderWrapper.id = "page-loader";
  loaderWrapper.className = "spinner-wrapper d-flex justify-content-center align-items-center flex-column py-5 fade-in-loader";
  loaderWrapper.style.minHeight = "50vh";

  loaderWrapper.innerHTML = `
    <div class="bouncing-dots">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <p class="mt-3 mb-0 fw-semibold" style="color: var(--text-light);">Loading content...</p>
  `;

  setTimeout(() => {
    app.innerHTML = "";
    app.appendChild(loaderWrapper);
    injectSpinnerStyles();
    isSpinnerVisible = true;
  }, delay);
}

export function hideSpinner() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.remove();
  isSpinnerVisible = false;
}

function injectSpinnerStyles() {
  if (document.getElementById("spinner-style")) return;

  const style = document.createElement("style");
  style.id = "spinner-style";
  style.textContent = `
    .bouncing-dots {
      display: flex;
      gap: 0.5rem;
    }
    .bouncing-dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--accent);
      animation: bounce 1.2s infinite ease-in-out;
    }
    .bouncing-dots span:nth-child(2) {
      animation-delay: 0.15s;
    }
    .bouncing-dots span:nth-child(3) {
      animation-delay: 0.3s;
    }
    .bouncing-dots span:nth-child(4) {
      animation-delay: 0.45s;
    }
    .bouncing-dots span:nth-child(5) {
      animation-delay: 0.6s;
    }
    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .fade-in-loader {
      opacity: 0;
      animation: fadeInLoader 0.4s ease-in-out forwards;
    }
    @keyframes fadeInLoader {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  document.head.appendChild(style);
}
