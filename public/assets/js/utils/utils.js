// assets/js/utils/utils.js

export function debounce(fn, delay = 50) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function htmlToElement(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}
