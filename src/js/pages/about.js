// src/js/pages/about.js — About page specific interactions

export function init() {
  initSkillBars();
}

function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = getComputedStyle(entry.target).getPropertyValue('--skill-level').trim();
          entry.target.style.width = level;
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
}
