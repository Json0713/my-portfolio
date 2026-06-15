// src/js/public/backgroundRenderer.js

const svgNS = "http://www.w3.org/2000/svg";

export function initBackgroundRenderer(type = 'cyber') {
  const container = document.querySelector('.cyber-background');
  if (!container) return;

  container.innerHTML = ''; // Clear existing

  if (type === 'none') {
    return;
  }

  const svg = document.createElementNS(svgNS, "svg");
  const width = window.innerWidth || 1200;
  const height = window.innerHeight || 800;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";

  if (type === 'cyber') {
    renderCyberBackground(svg, width, height, container);
  } else if (type === 'grid') {
    renderGridBackground(svg, width, height);
  } else if (type === 'aurora') {
    renderAuroraBackground(svg, width, height);
  }

  container.appendChild(svg);
}

// ==========================================
// 1. ORIGINAL CYBER BACKGROUND (Untouched Logic)
// ==========================================
function renderCyberBackground(svg, width, height, container) {
  function createDetailedHexagon(x, y, size) {
    const group = document.createElementNS(svgNS, "g");

    const hex = document.createElementNS(svgNS, "polygon");
    let points = "";
    const vertices = [];

    for (let a = 0; a < 6; a++) {
      const angle = (a * 60 + 30) * (Math.PI / 180);
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      points += `${px},${py} `;
      vertices.push({ px, py });
    }

    hex.setAttribute("points", points.trim());
    hex.setAttribute("fill", "currentColor");
    hex.setAttribute("fill-opacity", "0.05");
    hex.setAttribute("stroke", "currentColor");
    hex.setAttribute("stroke-width", "2");
    hex.setAttribute("stroke-opacity", "0.4");
    group.appendChild(hex);

    const innerHex = document.createElementNS(svgNS, "polygon");
    let innerPoints = "";
    const innerSize = size - 6;
    for (let a = 0; a < 6; a++) {
      const angle = (a * 60 + 30) * (Math.PI / 180);
      const px = x + innerSize * Math.cos(angle);
      const py = y + innerSize * Math.sin(angle);
      innerPoints += `${px},${py} `;
    }
    innerHex.setAttribute("points", innerPoints.trim());
    innerHex.setAttribute("fill", "none");
    innerHex.setAttribute("stroke", "currentColor");
    innerHex.setAttribute("stroke-width", "1");
    innerHex.setAttribute("stroke-opacity", "0.2");
    group.appendChild(innerHex);

    vertices.forEach(v => {
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", v.px);
      dot.setAttribute("cy", v.py);
      dot.setAttribute("r", "3");
      dot.setAttribute("fill", container.closest('[data-theme="dark"]') ? "#10262b" : "#e8f5f6");
      dot.setAttribute("stroke", "currentColor");
      dot.setAttribute("stroke-width", "1.5");
      group.appendChild(dot);
    });

    return group;
  }

  const hexSize = 75;
  const colOffset = Math.sqrt(3) * hexSize;
  const rowOffset = hexSize * 1.5;

  const cols = Math.ceil(width / colOffset) + 1;
  const rows = Math.ceil(height / rowOffset) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * colOffset;
      let y = r * rowOffset;

      if (r % 2 !== 0) {
        x += colOffset / 2;
      }

      const distTopLeft = Math.sqrt(x * x + y * y);
      const distBottomRight = Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2));
      const threshold = 400;

      if (distTopLeft > threshold && distBottomRight > threshold) continue;
      if ((distTopLeft > threshold - 100 || distBottomRight > threshold - 100) && Math.random() > 0.6) continue;

      const group = document.createElementNS(svgNS, "g");
      const delay = (x / width) * -12 + "s";
      group.style.animation = `cyberWave 8s ease-in-out ${delay} infinite alternate`;

      const detailedHex = createDetailedHexagon(x, y, hexSize);
      group.appendChild(detailedHex);
      svg.appendChild(group);
    }
  }

  const numScatteredShapes = 8;
  for (let i = 0; i < numScatteredShapes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;

    if (Math.sqrt(x * x + y * y) < 450 || Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2)) < 450) {
      continue;
    }

    const group = document.createElementNS(svgNS, "g");
    const delay = (x / width) * -12 + "s";
    group.style.animation = `cyberWave 8s ease-in-out ${delay} infinite alternate`;

    const type = Math.floor(Math.random() * 2);

    if (type === 0) {
      const size = 5;
      const line1 = document.createElementNS(svgNS, "line");
      line1.setAttribute("x1", x - size); line1.setAttribute("y1", y);
      line1.setAttribute("x2", x + size); line1.setAttribute("y2", y);
      line1.setAttribute("stroke", "currentColor");
      line1.setAttribute("stroke-width", "1.5");
      line1.setAttribute("stroke-opacity", "0.3");

      const line2 = document.createElementNS(svgNS, "line");
      line2.setAttribute("x1", x); line2.setAttribute("y1", y - size);
      line2.setAttribute("x2", x); line2.setAttribute("y2", y + size);
      line2.setAttribute("stroke", "currentColor");
      line2.setAttribute("stroke-width", "1.5");
      line2.setAttribute("stroke-opacity", "0.3");

      group.appendChild(line1);
      group.appendChild(line2);
    } else {
      const outer = document.createElementNS(svgNS, "circle");
      outer.setAttribute("cx", x);
      outer.setAttribute("cy", y);
      outer.setAttribute("r", 6);
      outer.setAttribute("fill", "none");
      outer.setAttribute("stroke", "currentColor");
      outer.setAttribute("stroke-width", "1");
      outer.setAttribute("stroke-dasharray", "2 2");
      outer.setAttribute("stroke-opacity", "0.3");
      group.appendChild(outer);
    }
    svg.appendChild(group);
  }
}

// ==========================================
// 2. DATA GRID BACKGROUND
// ==========================================
function renderGridBackground(svg, width, height) {
  // We use SVG defs for patterns and gradients
  const defs = document.createElementNS(svgNS, "defs");

  // Perspective grid pattern
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", "gridPattern");
  pattern.setAttribute("width", "60");
  pattern.setAttribute("height", "60");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M 60 0 L 0 0 0 60");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-opacity", "0.15");
  path.setAttribute("stroke-width", "1");
  pattern.appendChild(path);

  defs.appendChild(pattern);
  svg.appendChild(defs);

  const group = document.createElementNS(svgNS, "g");

  // Create a huge rect that is rotated/transformed to look like a perspective floor
  const gridRect = document.createElementNS(svgNS, "rect");
  gridRect.setAttribute("width", width * 2);
  gridRect.setAttribute("height", height * 2);
  gridRect.setAttribute("fill", "url(#gridPattern)");
  gridRect.setAttribute("x", -width / 2);
  gridRect.setAttribute("y", -height / 2);

  // Apply a 3D-like rotation
  gridRect.style.transformOrigin = "center center";
  gridRect.style.transform = "rotateX(60deg) translateY(-100px) scale(2)";

  // A slow pan animation
  group.style.animation = "cyberWave 15s ease-in-out infinite alternate";
  group.appendChild(gridRect);

  // Add some floating digital blocks
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 40 + 10;

    const block = document.createElementNS(svgNS, "rect");
    block.setAttribute("x", x);
    block.setAttribute("y", y);
    block.setAttribute("width", size);
    block.setAttribute("height", size);
    block.setAttribute("fill", "currentColor");
    block.setAttribute("fill-opacity", Math.random() * 0.1);
    block.setAttribute("stroke", "currentColor");
    block.setAttribute("stroke-opacity", "0.3");

    // Float animation
    const delay = Math.random() * -10 + "s";
    block.style.animation = `cyberWave ${Math.random() * 5 + 5}s ease-in-out ${delay} infinite alternate`;

    group.appendChild(block);
  }

  svg.appendChild(group);
}

// ==========================================
// 3. AURORA GLOW BACKGROUND
// ==========================================
function renderAuroraBackground(svg, width, height) {
  const defs = document.createElementNS(svgNS, "defs");

  // A heavy blur filter to create the premium glowing effect
  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "auroraBlur");
  filter.setAttribute("x", "-50%");
  filter.setAttribute("y", "-50%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");

  const blur = document.createElementNS(svgNS, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", width > 800 ? "150" : "80");
  filter.appendChild(blur);
  defs.appendChild(filter);
  svg.appendChild(defs);

  const group = document.createElementNS(svgNS, "g");
  group.setAttribute("filter", "url(#auroraBlur)");

  // Create large, slow-moving glowing orbs
  const numOrbs = 4;
  for (let i = 0; i < numOrbs; i++) {
    const orb = document.createElementNS(svgNS, "circle");

    // Position them roughly around the corners and center
    const xPositions = [width * 0.2, width * 0.8, width * 0.5, width * 0.1];
    const yPositions = [height * 0.2, height * 0.8, height * 0.5, height * 0.9];

    orb.setAttribute("cx", xPositions[i] || Math.random() * width);
    orb.setAttribute("cy", yPositions[i] || Math.random() * height);
    orb.setAttribute("r", width > 800 ? 300 + Math.random() * 100 : 150);

    orb.setAttribute("fill", "currentColor");
    // Inline opacity is omitted here because auroraWave CSS animation strictly controls the opacity channel.
    
    // Very slow, sweeping animation using the dedicated auroraWave
    const delay = Math.random() * -15 + "s";
    const duration = Math.random() * 10 + 15 + "s";
    orb.style.animation = `auroraWave ${duration} ease-in-out ${delay} infinite alternate`;

    group.appendChild(orb);
  }

  svg.appendChild(group);
}

// Regenerate on resize if the screen size changes drastically
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Only re-init if the container is still there (meaning we still want bg)
    const container = document.querySelector('.cyber-background');
    if (container && container.dataset.bgType) {
      initBackgroundRenderer(container.dataset.bgType);
    }
  }, 200);
});
