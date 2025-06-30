// assets/pages/hero.js – Refined, Lean, and Viewport-Aware

export function initHeroSection() {
  // Trigger animations when elements enter viewport
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        entry.target.classList.remove(
          ...Array.from(entry.target.classList).filter(cls => cls.startsWith("animate-"))
        );
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[class*="animate-"]').forEach(el => observer.observe(el));

  // Typing animation for tagline
  const typing = document.getElementById("typing-text");
  if (typing) {
    const fullText = typing.textContent.trim();
    typing.textContent = "";
    let i = 0;
    const type = () => {
      if (i < fullText.length) {
        typing.textContent += fullText[i++];
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
