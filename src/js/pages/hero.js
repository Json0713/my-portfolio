// src/js/pages/hero.js — Hero section specific interactions

export function init() {
  initTypingEffect();
  initThemeColorUpdate();
  initMarqueePause();
  initBadgeReveal();
  initBadgeIdleHover();
}

function initBadgeIdleHover() {
  const badges = document.querySelectorAll('.badge-stack img');
  if (!badges.length) return;

  function animateRandomBadge() {
    const badge = badges[Math.floor(Math.random() * badges.length)];
    badge.style.animation = 'badgeIdleHover 1s ease-in-out';
    setTimeout(() => (badge.style.animation = ''), 1000);
  }

  setInterval(() => {
    if (document.visibilityState === 'visible') {
      animateRandomBadge();
    }
  }, 3000);
}

function initTypingEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const typingText = document.getElementById('typing-text');
  const cursor = typingText?.querySelector('.cursor');
  if (!typingText || !cursor) return;

  const baseText = 'Web | Frontend ';
  const words = ['Developer', 'Architect'];
  let wordIndex = 0;
  let isDeleting = false;
  let text = '';
  let isTypingBase = true;

  // Clear existing text nodes, keep cursor
  Array.from(typingText.childNodes).forEach((node) => {
    if (node !== cursor) node.remove();
  });

  const textNode = document.createTextNode('');
  typingText.insertBefore(textNode, cursor);

  function type() {
    if (!document.body.contains(typingText)) return; // Stop animation if page changed

    const currentWord = words[wordIndex];
    let typeSpeed = 70;

    if (isTypingBase) {
      text = baseText.substring(0, text.length + 1);
      if (text === baseText) {
        isTypingBase = false;
        typeSpeed = 200;
      }
    } else {
      if (isDeleting) {
        text = baseText + currentWord.substring(0, text.length - baseText.length - 1);
        typeSpeed = 40;
      } else {
        text = baseText + currentWord.substring(0, text.length - baseText.length + 1);
      }

      if (!isDeleting && text === baseText + currentWord) {
        isDeleting = true;
        typeSpeed = 2500; // Pause longer when word is complete
      } else if (isDeleting && text === baseText) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing next word
      }
    }

    textNode.nodeValue = text;
    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 300);
}

function initThemeColorUpdate() {
  const cursor = document.querySelector('#typing-text .cursor');
  const updateColor = () => {
    if (cursor) {
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim();
      cursor.style.color = accent;
    }
  };
  const observer = new MutationObserver(updateColor);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  updateColor();
}

function initMarqueePause() {
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => (marquee.style.animationPlayState = 'paused'));
    marquee.addEventListener('mouseleave', () => (marquee.style.animationPlayState = 'running'));
  }
}

function initBadgeReveal() {
  const badgeStack = document.querySelector('.badge-stack');
  if (!badgeStack) return;

  const badgeImgs = badgeStack.querySelectorAll('img');
  badgeImgs.forEach((img) => img.classList.remove('animate-in'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let i = 0;
          const animateNext = () => {
            if (i < badgeImgs.length) {
              badgeImgs[i].classList.add('animate-in');
              i++;
              requestAnimationFrame(() => setTimeout(animateNext, 100));
            }
          };
          animateNext();
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(badgeStack);
}
