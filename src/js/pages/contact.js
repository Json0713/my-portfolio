// src/js/pages/contact.js — Contact form handling

export function init() {
  initContactForm();
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  const statusEl = document.getElementById('contact-status');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        statusEl.innerHTML =
          '<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>Message sent successfully! I\'ll get back to you soon.</span>';
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      statusEl.innerHTML =
        '<span class="text-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i>Something went wrong. Please try again or email me directly.</span>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
    }
  });
}
