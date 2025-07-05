// assets/js/routes/routerLink.js
import { $all } from "../utils/utils.js";


export function highlightActiveLink() {
  const currentRoute = window.location.hash || "#hero";
  $all(".main-nav a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active-link", href === currentRoute);
  });
}
