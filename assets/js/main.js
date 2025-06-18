// assets/js/main.js
const themeToggle = document.getElementById("theme-toggle");
const rootElement = document.documentElement;

function setTheme(theme) {
  rootElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = document.querySelector("#theme-toggle i");
  if (theme === "light") {
    icon.classList.remove("bi-brightness-high");
    icon.classList.add("bi-moon");
  } else {
    icon.classList.remove("bi-moon");
    icon.classList.add("bi-brightness-high");
  }

  updateAccent(theme);
  highlightActiveLink();
}

function updateAccent(theme) {
  const root = document.documentElement;
  const accent = theme === "light" ? "#e91e63" : "#00ffc3";
  root.style.setProperty("--accent", accent);
}

function toggleTheme() {
  const current = rootElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
}

function highlightActiveLink() {
  const links = document.querySelectorAll(".main-nav a");
  links.forEach(link => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === location.hash) {
      link.classList.add("active-link");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  themeToggle.addEventListener("click", toggleTheme);
  window.addEventListener("hashchange", highlightActiveLink);
});
