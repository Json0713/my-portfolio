// assets/js/common/toast.js

export function showToast(message, options = {}) {
  const {
    duration = 5000,
    type = "info" // options: info, success, warning, danger
  } = options;

  const typeColors = {
    info: "var(--accent)",
    success: "#198754",
    warning: "#ffc107",
    danger: "#dc3545",
  };

  const borderColor = typeColors[type] || typeColors.info;

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.style.cssText = `
    position: fixed;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-dark);
    color: var(--silver);
    border-left: 4px solid ${borderColor};
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
  }, duration);
}
