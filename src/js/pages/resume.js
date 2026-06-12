// src/js/pages/resume.js
import { $ } from '../utils/utils.js';

export function init() {
  const downloadBtn = $('#resume-download');

  // Directly trigger native print dialog
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
