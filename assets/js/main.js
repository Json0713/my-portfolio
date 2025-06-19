// assets/js/main.js
const themeToggle = document.getElementById("theme-toggle");
const rootElement = document.documentElement;

function setTheme(theme, profilePic, profilePicTest) {
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
  updateProfileImage(theme, profilePic, profilePicTest);
  highlightActiveLink();
}

function updateAccent(theme) {
  const accent = theme === "light" ? "#e91e63" : "#00ffc3";
  rootElement.style.setProperty("--accent", accent);
}

function updateProfileImage(theme, profilePic, profilePicTest) {
  const newSrc = theme === "light"
    ? "assets/images/received_674375172104708.jpeg"
    : "assets/images/May01-Portrait1-FINAL-100517.jpg";

  console.log("Switching theme to:", theme);
  console.log("New image path:", newSrc);

  [profilePic, profilePicTest].forEach((pic, index) => {
    if (!pic) return; // clean fail silently if not loaded yet

    console.log(`Updating image #${index} | current:`, pic.src);
    if (pic.src.includes(newSrc)) return;

    pic.classList.add("fade-out");
    setTimeout(() => {
      pic.src = newSrc;
      pic.onload = () => {
        pic.classList.remove("fade-out");
        pic.classList.add("fade-in");
        setTimeout(() => pic.classList.remove("fade-in"), 300);
        console.log(`Image #${index} updated with fade-in.`);
      };
    }, 200);
  });
}

function toggleTheme(profilePic, profilePicTest) {
  const current = rootElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  setTheme(next, profilePic, profilePicTest);
}

function initTheme(profilePic, profilePicTest) {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme, profilePic, profilePicTest);
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
  initTheme(null, null);
  themeToggle.addEventListener("click", () => {
    const profilePic = document.getElementById("profile-pic");
    const profilePicTest = document.getElementById("profile-pic-test");
    toggleTheme(profilePic, profilePicTest);
  });
  window.addEventListener("hashchange", highlightActiveLink);
});

document.addEventListener("componentsLoaded", () => {
  const profilePic = document.getElementById("profile-pic");
  const profilePicTest = document.getElementById("profile-pic-test");
  const currentTheme = rootElement.getAttribute("data-theme");
  updateProfileImage(currentTheme, profilePic, profilePicTest);
});
