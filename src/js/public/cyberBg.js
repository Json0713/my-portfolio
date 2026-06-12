// src/js/public/cyberBg.js

export function initCyberBackground() {
  const container = document.querySelector('.cyber-background');
  if (!container) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  
  // Use actual viewport size for precise side-placement
  const width = window.innerWidth || 1200;
  const height = window.innerHeight || 800;
  
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";

  // Function to create a highly detailed tech hexagon with vertex nodes
  function createDetailedHexagon(x, y, size) {
    const group = document.createElementNS(svgNS, "g");
    
    const hex = document.createElementNS(svgNS, "polygon");
    let points = "";
    const vertices = [];
    
    for (let a = 0; a < 6; a++) {
      // Offset angle by 30 degrees so flat sides are horizontal
      const angle = (a * 60 + 30) * (Math.PI / 180);
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      points += `${px},${py} `;
      vertices.push({px, py});
    }
    
    hex.setAttribute("points", points.trim());
    hex.setAttribute("fill", "currentColor");
    hex.setAttribute("fill-opacity", "0.05"); // Very subtle inner fill
    hex.setAttribute("stroke", "currentColor");
    hex.setAttribute("stroke-width", "2");
    hex.setAttribute("stroke-opacity", "0.4");
    group.appendChild(hex);

    // Inner glowing ring (simulating the double line in the image)
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

    // Add dots at each outer vertex
    vertices.forEach(v => {
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", v.px);
      dot.setAttribute("cy", v.py);
      dot.setAttribute("r", "3");
      dot.setAttribute("fill", container.closest('[data-theme="dark"]') ? "#10262b" : "#e8f5f6"); // Match background
      dot.setAttribute("stroke", "currentColor");
      dot.setAttribute("stroke-width", "1.5");
      group.appendChild(dot);
    });

    return group;
  }

  // 1. Draw Large Honeycomb clusters at Top-Left and Bottom-Right
  const hexSize = 75; // Much larger as requested
  // For point-up hexagons (rotated 30deg), the horizontal distance between columns is sqrt(3) * size
  // and vertical distance is 1.5 * size
  const colOffset = Math.sqrt(3) * hexSize;
  const rowOffset = hexSize * 1.5;

  const cols = Math.ceil(width / colOffset) + 1;
  const rows = Math.ceil(height / rowOffset) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * colOffset;
      let y = r * rowOffset;

      // Stagger odd rows
      if (r % 2 !== 0) {
        x += colOffset / 2;
      }

      // Check if this hexagon belongs to Top-Left or Bottom-Right corner
      const distTopLeft = Math.sqrt(x*x + y*y);
      const distBottomRight = Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2));
      
      // Threshold defines how far from the corner the cluster extends
      const threshold = 400; 

      if (distTopLeft > threshold && distBottomRight > threshold) {
        // Skip middle space completely to eliminate noise
        continue; 
      }

      // Randomly skip a few on the edges of the clusters to make it organic
      if ((distTopLeft > threshold - 100 || distBottomRight > threshold - 100) && Math.random() > 0.6) {
        continue;
      }

      const group = document.createElementNS(svgNS, "g");
      
      // Sweep opacity wave
      const delay = (x / width) * -12 + "s";
      group.style.animation = `cyberWave 8s ease-in-out ${delay} infinite alternate`;
      
      const detailedHex = createDetailedHexagon(x, y, hexSize);
      group.appendChild(detailedHex);

      svg.appendChild(group);
    }
  }

  // 2. Draw very minimal scattered tech shapes (only 8 shapes across the whole screen)
  const numScatteredShapes = 8;
  for (let i = 0; i < numScatteredShapes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    // Avoid drawing scattered shapes inside the honeycomb clusters
    if (Math.sqrt(x*x + y*y) < 450 || Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2)) < 450) {
      continue;
    }

    const group = document.createElementNS(svgNS, "g");
    const delay = (x / width) * -12 + "s";
    group.style.animation = `cyberWave 8s ease-in-out ${delay} infinite alternate`;

    const type = Math.floor(Math.random() * 2);
    
    if (type === 0) {
      // Tech Crosshair
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
      // Tech Node (Circle)
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

  container.innerHTML = '';
  container.appendChild(svg);
}

// Regenerate on resize if the screen size changes drastically
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initCyberBackground();
  }, 200);
});
