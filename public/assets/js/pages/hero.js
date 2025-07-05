// assets/pages/hero.js

export function initHeroSection() {
  initAnimations();
  initTypingEffect();
  initThemeColorUpdate();
  initMarqueePause();
  initBadgeReveal();
  initBadgeIdleHover();
}

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

function initBadgeIdleHover() {
  const badges = document.querySelectorAll(".badge-stack img");

  function animateRandomBadge() {
    const badge = badges[Math.floor(Math.random() * badges.length)];
    badge.style.animation = "badgeIdleHover 1s ease-in-out";
    setTimeout(() => badge.style.animation = "", 1000);
  }

  setInterval(() => {
    if (document.visibilityState === "visible") {
      animateRandomBadge();
    }
  }, 3000);
}

function initTypingEffect() {
  const typingText = document.getElementById("typing-text");
  const cursor = typingText?.querySelector(".cursor");
  const rawText = typingText?.dataset.text?.trim() || "Software | Frontend Developer";

  if (typingText && cursor) {
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
}

function initThemeColorUpdate() {
  const cursor = document.querySelector("#typing-text .cursor");
  const updateColor = () => {
    if (cursor) {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      cursor.style.color = accent;
    }
  };
  const observer = new MutationObserver(updateColor);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateColor();
}

function initMarqueePause() {
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
    marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
  }
}

function initBadgeReveal() {
  const badgeStack = document.querySelector(".badge-stack");
  if (!badgeStack) return;

  const badgeImgs = badgeStack.querySelectorAll("img");
  badgeImgs.forEach(img => img.classList.remove("animate-in"));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let i = 0;
        const animateNext = () => {
          if (i < badgeImgs.length) {
            badgeImgs[i].classList.add("animate-in");
            i++;
            requestAnimationFrame(() => setTimeout(animateNext, 100));
          }
        };
        animateNext();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 1.0 });

  observer.observe(badgeStack);
}
