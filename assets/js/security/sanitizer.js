// assets/js/security/sanitizer.js

// Minimal DOMPurify-style sanitization using a basic built-in API fallback
// For more robust needs, replace this with the full DOMPurify library

export function sanitizeHTML(dirty) {
  const template = document.createElement("template");
  template.innerHTML = dirty;
  
  // Remove script tags as a minimal security step
  const scripts = template.content.querySelectorAll("script");
  scripts.forEach(script => script.remove());

  return template.innerHTML;
}
