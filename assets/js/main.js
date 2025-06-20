// assets/js/main.js

const rootElement = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function getCurrentTheme() {
  return rootElement.getAttribute("data-theme") || "dark";
}

function saveTheme(theme) {
  rootElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function setThemeIcon(theme) {
  const icon = themeToggle?.querySelector("i");
  if (!icon) return;
  icon.classList.toggle("bi-brightness-high", theme === "dark");
  icon.classList.toggle("bi-moon", theme === "light");
}

function updateAccent(theme) {
  const accent = theme === "light" ? "#e91e63" : "#00ffc3";
  rootElement.style.setProperty("--accent", accent);
}

function updateProfileImage(theme, ...images) {
  const newSrc = theme === "light"
    ? "assets/images/light-1x1-profile.jpg"
    : "assets/images/dark-1x1-profile.jpg";

  images.forEach((img) => {
    if (!img) return;

    if (!img.src || img.src === window.location.href) {
      img.src = newSrc;
      return;
    }

    if (img.src.includes(newSrc)) return;

    img.classList.add("fade-out");
    setTimeout(() => {
      img.src = newSrc;
      img.onload = () => {
        img.classList.remove("fade-out");
        img.classList.add("fade-in");
        setTimeout(() => img.classList.remove("fade-in"), 300);
      };
    }, 200);
  });
}

function applyTheme(theme, ...images) {
  saveTheme(theme);
  setThemeIcon(theme);
  updateAccent(theme);
  updateProfileImage(theme, ...images);
  highlightActiveLink();
}

function toggleTheme(...images) {
  const current = getCurrentTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next, ...images);
}

function initTheme(...images) {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme, ...images);
}

function highlightActiveLink() {
  document.querySelectorAll(".main-nav a").forEach(link => {
    link.classList.toggle("active-link", link.getAttribute("href") === location.hash);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  themeToggle?.addEventListener("click", () => {
    const pic1 = document.getElementById("profile-pic");
    const pic2 = document.getElementById("profile-pic-test");
    toggleTheme(pic1, pic2);
  });

  window.addEventListener("hashchange", highlightActiveLink);
});

document.addEventListener("componentsLoaded", () => {
  const pic1 = document.getElementById("profile-pic");
  const pic2 = document.getElementById("profile-pic-test");
  const theme = getCurrentTheme();
  updateProfileImage(theme, pic1, pic2);
});
