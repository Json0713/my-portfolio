// src/js/security/sanitizer.js
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content using DOMPurify.
 * Prevents XSS attacks when injecting fetched HTML fragments.
 */
export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty);
}
