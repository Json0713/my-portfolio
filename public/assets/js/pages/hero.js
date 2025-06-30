// assets/pages/hero.js

export function initHeroSection() {
  // Animate elements on scroll
  const animatedElements = document.querySelectorAll('[class*="hero-"]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("fade-in");
        el.classList.remove(...[...el.classList].filter(cls => cls.startsWith("hero-")));
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  // Typing animation with blinking accent cursor
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
    type();
  }

  // Marquee pause on hover
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.addEventListener("mouseenter", () => marquee.style.animationPlayState = "paused");
    marquee.addEventListener("mouseleave", () => marquee.style.animationPlayState = "running");
  }
}
