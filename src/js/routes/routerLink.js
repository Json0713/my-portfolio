// src/js/routes/routerLink.js
import { $all } from '../utils/utils.js';

export function highlightActiveLink() {
  const currentRoute = window.location.hash || '#hero';
  $all('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === currentRoute;
    link.classList.toggle('active-link', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
