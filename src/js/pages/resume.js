// src/js/pages/resume.js
import * as bootstrap from 'bootstrap';
import html2pdf from 'html2pdf.js';
import { $ } from '../utils/utils.js';
import { showToast } from '../common/toast.js';

export function init() {
  const modalEl = $('#printPreviewModal');
  
  // Fix z-index stacking context issue by moving modal out of `#app` and into `body`
  if (modalEl && modalEl.parentNode !== document.body) {
    document.body.appendChild(modalEl);
  }

  const downloadBtn = $('#confirm-pdf-download');
  const nativePrintBtn = $('#native-print-btn');
  const progressContainer = $('#pdf-progress-container');

  // Handle Native Print Dialog Option
  if (nativePrintBtn && modalEl) {
    nativePrintBtn.addEventListener('click', () => {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
      
      // Allow modal close animation to finish before freezing main thread with print dialog
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', async () => {
    // 1. Target the specific resume content container
    const element = document.querySelector('.resume-content');
    if (!element) {
      showToast('Error: Resume content not found.', { type: 'error' });
      return;
    }

    // 2. Prepare the UI
    downloadBtn.disabled = true;
    progressContainer.classList.remove('d-none');

    // 3. Temporarily modify styles to ensure the PDF looks like a clean white paper document,
    // bypassing dark mode colors if active.
    const originalStyle = element.style.cssText;
    element.style.padding = '2rem';
    element.style.background = '#ffffff';
    element.style.color = '#1f2937'; // tailwind gray-800
    
    // Force specific child elements to have print-friendly colors
    const cards = element.querySelectorAll('.resume-entry');
    cards.forEach(card => {
      card.dataset.originalBg = card.style.background;
      card.style.background = 'transparent';
      card.style.border = '1px solid #e5e7eb'; // light border
    });

    const headings = element.querySelectorAll('h2, h3, h4, h5, h6');
    headings.forEach(h => {
      h.dataset.originalColor = h.style.color;
      // if it's an accent heading, ensure it's not too light on white
      if (h.classList.contains('text-accent')) {
        h.style.color = '#2563eb'; // standard strong blue
      } else {
        h.style.color = '#111827'; 
      }
    });

    // 4. Configure html2pdf options
    const opt = {
      margin:       0.5,
      filename:     'Jason_Bayaga_Resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      // 5. Execute PDF generation
      await html2pdf().set(opt).from(element).save();
      
      // Close modal gracefully
      const modalEl = $('#printPreviewModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }
      
      showToast('<i class="bi bi-file-earmark-pdf"></i> PDF successfully generated!', { type: 'success' });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Failed to generate PDF.', { type: 'error' });
    } finally {
      // 6. Restore original styles
      element.style.cssText = originalStyle;
      
      cards.forEach(card => {
        card.style.background = card.dataset.originalBg || '';
        card.style.border = '';
        delete card.dataset.originalBg;
      });

      headings.forEach(h => {
        h.style.color = h.dataset.originalColor || '';
        delete h.dataset.originalColor;
      });

      downloadBtn.disabled = false;
      progressContainer.classList.add('d-none');
    }
  });
}
