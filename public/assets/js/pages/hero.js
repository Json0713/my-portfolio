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
  }, { threshold: 0.1 });

  animatedEls.forEach(el => {
    if (!el.classList.contains("animate-in")) {
      observer.observe(el);
    }
  });

  // Typing animation with blinking cursor
  const typingText = document.getElementById("typing-text");
  const cursor = typingText?.querySelector(".cursor");

  if (typingText && cursor) {
    const fullText = typingText.textContent.replace("|", "").trim();
    typingText.textContent = "";
    typingText.appendChild(cursor);
    let i = 0;

    const type = () => {
      if (i < fullText.length) {
        typingText.insertBefore(document.createTextNode(fullText.charAt(i)), cursor);
        i++;
        setTimeout(type, 60);
      }
    };
    setTimeout(type, 300); // slight initial delay
  }

  // Marquee pause on hover
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
    marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
  }
} 
