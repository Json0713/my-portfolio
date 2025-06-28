// assets/js/common/smartInstallPanel.js

let deferredPrompt = null;
let panelVisible = false;
let dragStartX = 0;

export function setupSmartInstallPanel() {
  if (isStandaloneMode()) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (!document.getElementById("smart-panel")) {
      createInstallUI();
    }
  });
}

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function createInstallUI() {
  const container = document.createElement("div");
  container.id = "smart-panel";
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%);
    background: var(--bg-dark);
    color: var(--silver);
    border-right: 4px solid var(--accent);
    box-shadow: 2px 0 8px rgba(0,0,0,0.3);
    padding: 1rem;
    z-index: 9999;
    max-width: 260px;
    width: 85vw;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border-radius: 0 8px 8px 0;
    pointer-events: auto;
  `;

  container.innerHTML = `
    <div id="panel-header" style="display:flex;justify-content:space-between;align-items:center;">
      <strong id="panel-title">Install this app</strong>
      <button id="panel-close" style="background:none;border:none;font-size:1.25rem;color:var(--silver);">&times;</button>
    </div>
    <div id="panel-actions">
      <button id="install-btn" class="btn btn-sm btn-success">Install</button>
    </div>
    <div id="progress-container" style="display:none;">
      <div class="progress" style="height: 6px; background: #333;">
        <div id="progress-bar" class="progress-bar" style="width: 0%; background: var(--accent);"></div>
      </div>
      <div id="progress-status" style="font-size: 0.8rem; color: var(--silver); margin-top: 0.25rem;"></div>
    </div>
  `;

  const handle = document.createElement("div");
  handle.id = "panel-handle";
  handle.style.cssText = `
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background: var(--accent);
    border-radius: 0 6px 6px 0;
    padding: 0.25rem 0.4rem;
    z-index: 9998;
    cursor: pointer;
    color: white;
    height: 60px;
    display: flex;
    align-items: center;
  `;
  handle.innerHTML = `<i class="bi bi-chevron-double-right"></i>`;

  document.body.appendChild(container);
  document.body.appendChild(handle);

  restorePanelState(container);

  handle.addEventListener("click", () => togglePanel(container));
  handle.addEventListener("touchstart", e => dragStartX = e.touches[0].clientX);
  handle.addEventListener("touchmove", e => {
    const dx = e.touches[0].clientX - dragStartX;
    if (dx > 40) togglePanel(container);
  });

  document.getElementById("panel-close")?.addEventListener("click", () => {
    panelVisible = false;
    container.style.transform = "translate(-100%, -50%)";
    localStorage.setItem("smartPanel:visible", "false");
  });

  document.getElementById("install-btn")?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    const progressWrap = document.getElementById("progress-container");
    const bar = document.getElementById("progress-bar");
    const status = document.getElementById("progress-status");

    progressWrap.style.display = "block";
    status.textContent = "Installing...";

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 8, 90);
      bar.style.width = `${progress}%`;
    }, 300);

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    clearInterval(interval);
    deferredPrompt = null;

    if (outcome === "accepted") {
      bar.style.width = "100%";
      status.textContent = "Installation was ready!";
      setTimeout(() => {
        container.remove();
        handle.remove();
      }, 4000);
    }
  });
}

function togglePanel(panel) {
  if (panelVisible) {
    panel.style.transform = "translate(-100%, -50%)";
    panelVisible = false;
    localStorage.setItem("smartPanel:visible", "false");
  } else {
    panel.style.transform = "translate(0, -50%)";
    panelVisible = true;
    localStorage.setItem("smartPanel:visible", "true");
    setTimeout(() => {
      if (panelVisible) {
        panel.style.transform = "translate(-100%, -50%)";
        panelVisible = false;
        localStorage.setItem("smartPanel:visible", "false");
      }
    }, 45000);
  }
}

function restorePanelState(panel) {
  const state = localStorage.getItem("smartPanel:visible");
  if (state === "true") {
    panel.style.transform = "translate(0, -50%)";
    panelVisible = true;
  }
}
