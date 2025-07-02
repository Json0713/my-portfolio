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
    initBadgeIdleHover();
  });
  
  function initBadgeIdleHover() {
    const badges = document.querySelectorAll(".badge-stack img");
  
    function animateRandomBadge() {
      const badge = badges[Math.floor(Math.random() * badges.length)];
      badge.style.animation = "badgeIdleHover 1s ease-in-out";
  
      // Remove animation after done
      setTimeout(() => {
        badge.style.animation = "";
      }, 1000);
    }
  
    setInterval(() => {
      if (document.visibilityState === "visible") {
        animateRandomBadge();
      }
    }, 3000); // every 3s one badge animates
  }

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

  const updateTypingTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    const isLight = theme === "light";
    if (cursor) {
      cursor.style.color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent").trim();
    }
  };

  const themeObserver = new MutationObserver(updateTypingTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateTypingTheme();

  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
    marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
  }

  const badgeStack = document.querySelector(".badge-stack");
  if (badgeStack) {
    const badgeImgs = badgeStack.querySelectorAll("img");
    badgeImgs.forEach(img => img.classList.remove("animate-in"));

    const badgeObserver = new IntersectionObserver((entries, obs) => {
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

    badgeObserver.observe(badgeStack);
  }
}
