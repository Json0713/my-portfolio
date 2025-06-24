// assets/js/routes/router.js

export function highlightActiveLink() {
  const currentPath = location.hash || location.pathname;
  document.querySelectorAll(".main-nav a").forEach(link => {
    const linkHref = link.getAttribute("href");
    const isActive = linkHref === currentPath;
    link.classList.toggle("active-link", isActive);
  });
}
