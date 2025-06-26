// assets/js/utils/utils.js

// Utility: Debounce function
export function debounce(fn, delay = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Utility: Safely get element by selector
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

// Utility: Safely get all elements by selector
export function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

// Future: Add more reusable DOM or formatting helpers here
