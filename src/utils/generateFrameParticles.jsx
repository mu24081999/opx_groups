// Rectangle frame particle positions
export const generateFrameParticles = (width, height, spacing = 1, z = 0) => {
  const points = [];
  let idx = 0;

  const halfW = width / 2;
  const halfH = height / 2;

  // Bottom edge
  for (let x = -halfW; x <= halfW; x += spacing) {
    points.push({ position: [x, -halfH, z], color: "#ff0000", idx: idx++ });
  }

  // Top edge
  for (let x = -halfW; x <= halfW; x += spacing) {
    points.push({ position: [x, halfH, z], color: "#ff0000", idx: idx++ });
  }

  // Left edge
  for (let y = -halfH + spacing; y <= halfH - spacing; y += spacing) {
    points.push({ position: [-halfW, y, z], color: "#ff0000", idx: idx++ });
  }

  // Right edge
  for (let y = -halfH + spacing; y <= halfH - spacing; y += spacing) {
    points.push({ position: [halfW, y, z], color: "#ff0000", idx: idx++ });
  }

  return points;
};
