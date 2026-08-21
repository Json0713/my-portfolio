// src/js/public/customizer.js
import { Offcanvas } from 'bootstrap';
import { initBackgroundRenderer } from './backgroundRenderer.js';

const rootElement = document.documentElement;

// Elements
const customizerPanel = document.getElementById('customizerPanel');
const darkSwatches = document.querySelectorAll('.color-swatch.color-dark');
const lightSwatches = document.querySelectorAll('.color-swatch.color-light');
const reduceMotionToggle = document.getElementById('reduceMotionToggle');
const bgStyleBtns = document.querySelectorAll('.bg-style-btn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const cyberBgEl = document.querySelector('.cyber-background');

// Defaults
const DEFAULT_DARK = { hex: '#00ffc3', rgb: '0, 255, 195' };
const DEFAULT_LIGHT = { hex: '#004d40', rgb: '0, 77, 64' };

export function initCustomizer() {
  if (!customizerPanel) return;

  loadSettings();
  setupEventListeners();

  // Listen for theme changes to apply the correct active accent
  const observer = new MutationObserver(() => applyCurrentThemeAccent());
  observer.observe(rootElement, { attributes: true, attributeFilter: ['data-theme'] });
  
  // Highlight correct swatches on init
  highlightActiveSwatches();
}

function setupEventListeners() {
  darkSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const color = e.target.dataset.color;
      const rgb = e.target.dataset.rgb;
      updateSavedAccent('dark', color, rgb);
      applyCurrentThemeAccent();
      highlightActiveSwatches();
    });
  });

  lightSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      const color = e.target.dataset.color;
      const rgb = e.target.dataset.rgb;
      updateSavedAccent('light', color, rgb);
      applyCurrentThemeAccent();
      highlightActiveSwatches();
    });
  });

  if (reduceMotionToggle) {
    reduceMotionToggle.addEventListener('change', (e) => {
      applyReduceMotion(e.target.checked);
      saveSettings();
    });
  }

  if (bgStyleBtns.length > 0) {
    bgStyleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bgType = e.currentTarget.dataset.bg;
        applyBackgroundStyle(bgType);
        updateActiveBgStyleBtn(bgType);
        saveSettings();
      });
    });
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetSettings);
  }

  // Auto-close when clicking outside
  document.addEventListener('click', (event) => {
    if (customizerPanel && customizerPanel.classList.contains('show')) {
      const isClickInside = customizerPanel.contains(event.target);
      const isClickOnToggle = event.target.closest('.customizer-btn');
      
      if (!isClickInside && !isClickOnToggle) {
        const bsOffcanvas = Offcanvas.getInstance(customizerPanel);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
    }
  });
}

function applyCurrentThemeAccent() {
  const settings = getSettings();
  const theme = rootElement.getAttribute('data-theme') || 'dark';
  
  const hex = theme === 'dark' ? settings.darkAccent : settings.lightAccent;
  const rgb = theme === 'dark' ? settings.darkAccentRgb : settings.lightAccentRgb;
  
  if (hex && rgb) {
    rootElement.style.setProperty('--accent', hex);
    rootElement.style.setProperty('--accent-rgb', rgb);
  } else {
    rootElement.style.removeProperty('--accent');
    rootElement.style.removeProperty('--accent-rgb');
  }
}

function updateSavedAccent(themeMode, hex, rgb) {
  const settings = getSettings();
  if (themeMode === 'dark') {
    settings.darkAccent = hex;
    settings.darkAccentRgb = rgb;
  } else {
    settings.lightAccent = hex;
    settings.lightAccentRgb = rgb;
  }
  localStorage.setItem('siteCustomizerSettings', JSON.stringify(settings));
}

function highlightActiveSwatches() {
  const settings = getSettings();
  
  // Highlight Dark
  darkSwatches.forEach(s => s.classList.remove('active'));
  const activeDark = Array.from(darkSwatches).find(s => s.dataset.color === settings.darkAccent) || darkSwatches[0];
  if (activeDark) activeDark.classList.add('active');

  // Highlight Light
  lightSwatches.forEach(s => s.classList.remove('active'));
  const activeLight = Array.from(lightSwatches).find(s => s.dataset.color === settings.lightAccent) || lightSwatches[0];
  if (activeLight) activeLight.classList.add('active');
}

function applyReduceMotion(isReduced) {
  if (isReduced) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
  
  if (!isReduced) {
    window.dispatchEvent(new Event('scroll'));
  }
}

function applyBackgroundStyle(bgType) {
  const container = document.querySelector('.cyber-background');
  if (container) {
    container.dataset.bgType = bgType;
  }
  initBackgroundRenderer(bgType);
}

function updateActiveBgStyleBtn(bgType) {
  if (bgStyleBtns.length === 0) return;
  bgStyleBtns.forEach(btn => {
    if (btn.dataset.bg === bgType) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function getSettings() {
  const saved = localStorage.getItem('siteCustomizerSettings');
  const defaults = {
    darkAccent: DEFAULT_DARK.hex,
    darkAccentRgb: DEFAULT_DARK.rgb,
    lightAccent: DEFAULT_LIGHT.hex,
    lightAccentRgb: DEFAULT_LIGHT.rgb,
    reduceMotion: false,
    bgType: 'cyber'
  };
  
  if (saved) {
    try { return { ...defaults, ...JSON.parse(saved) }; } catch (e) { return defaults; }
  }
  return defaults;
}

function saveSettings() {
  const settings = getSettings();
  if (reduceMotionToggle) settings.reduceMotion = reduceMotionToggle.checked;
  const activeBgBtn = document.querySelector('.bg-style-btn.active');
  if (activeBgBtn) settings.bgType = activeBgBtn.dataset.bg;
  localStorage.setItem('siteCustomizerSettings', JSON.stringify(settings));
}

function loadSettings() {
  const settings = getSettings();
  
  applyCurrentThemeAccent();
  
  if (reduceMotionToggle) {
    reduceMotionToggle.checked = settings.reduceMotion;
    applyReduceMotion(settings.reduceMotion);
  }
  updateActiveBgStyleBtn(settings.bgType);
  applyBackgroundStyle(settings.bgType);
}

function resetSettings() {
  localStorage.removeItem('siteCustomizerSettings');
  
  rootElement.style.removeProperty('--accent');
  rootElement.style.removeProperty('--accent-rgb');
  
  if (reduceMotionToggle) {
    reduceMotionToggle.checked = false;
    applyReduceMotion(false);
  }
  
  updateActiveBgStyleBtn('cyber');
  applyBackgroundStyle('cyber');
  
  applyCurrentThemeAccent();
  highlightActiveSwatches();
  saveSettings();
}
