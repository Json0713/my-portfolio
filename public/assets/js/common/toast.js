// assets/js/common/toast.js

let toastQueue = [];
let toastContainer = null;

export function showToast(message, options = {}) {
  const {
    duration = 4000,
    type = "info" // options: info, success, warning, danger
  } = options;

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.style.cssText = `
      position: fixed;
      top: 120px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 85vw;
    `;
    document.body.appendChild(toastContainer);
  }

  const typeColors = {
    info: "var(--accent)",
    success: "#198754",
    warning: "#ffc107",
    danger: "#dc3545"
  };

  const borderColor = typeColors[type] || typeColors.info;

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.style.cssText = `
    background: var(--bg-dark);
    color: var(--silver);
    border-left: 4px solid ${borderColor};
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: auto;
    width: 100%;
  `;

  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
} 
