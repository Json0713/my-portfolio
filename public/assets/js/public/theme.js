// assets/js/public/theme.js

import { announceTheme } from '../utils/accessibility.js';
import { highlightActiveLink } from '../routes/routerLink.js';

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
  const accent = theme === "light" ? "#004d40" : "#00ffc3";
  rootElement.style.setProperty("--accent", accent);
}

function flashThemeEffect() {
  rootElement.classList.add("theme-flash");
  setTimeout(() => {
    rootElement.classList.remove("theme-flash");
  }, 400);
}

function updateThemeToggleUI(theme) {
  if (!themeToggleInput) return;
  themeToggleInput.checked = theme === "light";
}

function applyTheme(theme, { flash = true } = {}) {
  if (!rootElement.hasAttribute("data-theme")) {
    rootElement.setAttribute("data-theme", theme);
  }
  saveTheme(theme);
  updateAccent(theme);
  highlightActiveLink();
  updateThemeToggleUI(theme);
  if (flash) flashThemeEffect();
  announceTheme(theme);
}

function toggleTheme() {
  const current = rootElement.getAttribute("data-theme") || getPreferredTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
}

export function initTheme() {
  const preferred = getPreferredTheme();
  applyTheme(preferred, { flash: false });
  rootElement.classList.remove("js-loading");
}

export function setupThemeToggle() {
  if (!themeToggleInput) return;

  themeToggleInput.addEventListener("change", () => {
    toggleTheme();
  });

  let highlightTimeout;
  window.addEventListener("hashchange", () => {
    clearTimeout(highlightTimeout);
    highlightTimeout = setTimeout(highlightActiveLink, 50);
  });

  window.addEventListener("popstate", () => {
    clearTimeout(highlightTimeout);
    highlightTimeout = setTimeout(highlightActiveLink, 50);
  });
}
