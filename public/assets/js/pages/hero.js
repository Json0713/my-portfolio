// assets/js/pages/hero.js

function initAnimations() {
  const animatedEls = document.querySelectorAll('[class*="animate-"]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => {
    if (!el.classList.contains("animate-in")) {
      observer.observe(el);
    }
  });
}

function initTyping() {
  const typingText = document.getElementById("typing-text");
  const cursor = typingText?.querySelector(".cursor");

  if (!typingText || !cursor) return;

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

function syncCursorAccent() {
  const cursor = document.querySelector("#typing-text .cursor");
  if (cursor) {
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    cursor.style.color = accent;
  }
}

function initThemeSync() {
  syncCursorAccent();
  const themeObserver = new MutationObserver(syncCursorAccent);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

function initMarqueeHover() {
  const marquee = document.querySelector(".marquee-track");
  if (!marquee) return;

  marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
  marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
}

function initBadgeReveal() {
  const badgeStack = document.querySelector(".badge-stack");
  if (!badgeStack) return;

  const badgeImgs = badgeStack.querySelectorAll("img");
  badgeImgs.forEach(img => {
    img.classList.remove("animate-in");
    img.style.opacity = 0;
    img.style.animation = "none";
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let i = 0;
        const animateNext = () => {
          if (i < badgeImgs.length) {
            const img = badgeImgs[i];
            img.style.animation = `flipBadgeIn 0.6s ease forwards ${i * 100}ms`;
            img.style.opacity = 1;
            i++;
            setTimeout(animateNext, 80);
          }
        };
        setTimeout(animateNext, 300);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  observer.observe(badgeStack);
}

export function initHeroSection() {
  initAnimations();
  initTyping();
  initThemeSync();
  initMarqueeHover();
  initBadgeReveal();
}
