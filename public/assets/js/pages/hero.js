// assets/pages/hero.js

export function initHeroSection() {
  const animatedEls = document.querySelectorAll('[class*="animate-"]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("animate-in");
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => {
    if (!el.classList.contains("animate-in")) {
      observer.observe(el);
    }
  });

  // Typing animation with accent cursor + theme sync
  const typingText = document.getElementById("typing-text");
  const cursor = typingText?.querySelector(".cursor");

  if (typingText && cursor) {
    const rawText = typingText.dataset.text?.trim() || "Software | Frontend Developer";
    typingText.textContent = "";
    typingText.appendChild(cursor);
    let i = 0;

    const typeChar = () => {
      if (i < rawText.length) {
        typingText.insertBefore(document.createTextNode(rawText.charAt(i)), cursor);
        i++;
        setTimeout(typeChar, 70);
      }
    };
    setTimeout(typeChar, 300);
  }

  // Theme toggle fix for cursor visibility
  const updateTypingTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    const isLight = theme === "light";
    if (cursor) {
      cursor.style.color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent").trim();
    }
  };

  // Observe theme change for cursor
  const themeObserver = new MutationObserver(updateTypingTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateTypingTheme();

  // Marquee hover control
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
    marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
  }
}
