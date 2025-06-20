// assets/js/main.js

const rootElement = document.documentElement;
const themeToggleInput = document.getElementById("theme-toggle");

function getPreferredTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function saveTheme(theme) {
  rootElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function updateAccent(theme) {
  const accent = theme === "light" ? "#e91e63" : "#00ffc3";
  rootElement.style.setProperty("--accent", accent);
}

function flashThemeEffect() {
  rootElement.classList.add("theme-flash");
  setTimeout(() => rootElement.classList.remove("theme-flash"), 400);
}

function applyTheme(theme) {
  saveTheme(theme);
  updateAccent(theme);
  highlightActiveLink();
  updateThemeToggleUI(theme);
  flashThemeEffect();
  announceTheme(theme);
}

function toggleTheme() {
  const current = rootElement.getAttribute("data-theme") || getPreferredTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
}

function initTheme() {
  const preferred = getPreferredTheme();
  applyTheme(preferred);
}

function highlightActiveLink() {
  document.querySelectorAll(".main-nav a").forEach(link => {
    const isActive = link.getAttribute("href") === location.hash;
    link.classList.toggle("active-link", isActive);
  });
}

function announceTheme(theme) {
  const existing = document.getElementById("theme-announcer");
  if (existing) existing.remove();

  const liveRegion = document.createElement("div");
  liveRegion.id = "theme-announcer";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("role", "status");
  liveRegion.className = "visually-hidden";
  liveRegion.textContent = `Theme changed to ${theme}`;
  document.body.appendChild(liveRegion);
}

function updateThemeToggleUI(theme) {
  if (!themeToggleInput) return;
  themeToggleInput.checked = theme === "light";
}

function setupThemeToggle() {
  if (!themeToggleInput) return;

  themeToggleInput.addEventListener("change", () => {
    toggleTheme();
  });

  window.addEventListener("hashchange", () => {
    requestAnimationFrame(highlightActiveLink);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
});

document.addEventListener("componentsLoaded", () => {
  // No dynamic profile image logic needed anymore
});
