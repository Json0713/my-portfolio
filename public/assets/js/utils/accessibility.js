// assets/js/utils/accessibility.js

export function announceTheme(theme) {
  const existing = document.getElementById("theme-announcer");
  if (existing) existing.remove();

  if (!document.body) return;

  const liveRegion = document.createElement("div");
  liveRegion.id = "theme-announcer";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "visually-hidden";
  liveRegion.textContent = `Theme changed to ${theme}`;
  document.body.appendChild(liveRegion);

  setTimeout(() => liveRegion.remove(), 1500);
}

