const MIN_RADIUS = 7.5;
const MAX_RADIUS = 15;
const DEPTH = 2;
const LEFT_COLOR = "6366f1";
const RIGHT_COLOR = "8b5cf6";
const NUM_POINTS = 2500;

const getGradientStop = (ratio) => {
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  const c0 = LEFT_COLOR.match(/.{1,2}/g).map(
    (oct) => parseInt(oct, 16) * (1 - ratio)
  );
  const c1 = RIGHT_COLOR.match(/.{1,2}/g).map(
    (oct) => parseInt(oct, 16) * ratio
  );
  const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
  const color = ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};

const calculateColor = (x) => {
  const maxDiff = MAX_RADIUS * 2;
  const distance = x + MAX_RADIUS;
  const ratio = distance / maxDiff;
  return getGradientStop(ratio);
};

const randomFromInterval = (min, max) => {
  return Math.random() * (max - min) + min;
};

// export const pointsInner = Array.from({ length: NUM_POINTS }, (_, k) => {
//   const radius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
//   const angle = Math.random() * Math.PI * 2;
//   const x = Math.cos(angle) * radius;
//   const y = Math.sin(angle) * radius;
//   const z = randomFromInterval(-DEPTH, DEPTH);
//   const color = calculateColor(x);

//   return { idx: k + 1, position: [x, y, z], color };
// });
export const pointsInner = Array.from({ length: NUM_POINTS }, (_, k) => {
  // Create more organized pattern for better sequential flow
  const rings = 8; // Number of concentric rings
  const pointsPerRing = NUM_POINTS / rings;
  const ringIndex = Math.floor(k / pointsPerRing);
  const pointInRing = k % pointsPerRing;

  const radius = MIN_RADIUS + (ringIndex / rings) * (MAX_RADIUS - MIN_RADIUS);
  const angle = (pointInRing / pointsPerRing) * Math.PI * 2;

  // Add some randomness to avoid too rigid pattern
  const radiusVariation = randomFromInterval(-0.5, 0.5);
  const angleVariation = randomFromInterval(-0.1, 0.1);

  const finalRadius = radius + radiusVariation;
  const finalAngle = angle + angleVariation;

  const x = Math.cos(finalAngle) * finalRadius;
  const y = Math.sin(finalAngle) * finalRadius;
  const z = randomFromInterval(-DEPTH, DEPTH);

  const color = calculateColor(x);

  return { idx: k + 1, position: [x, y, z], color };
});

export const pointsOuter = Array.from({ length: NUM_POINTS / 4 }, (_, k) => {
  const radius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);
  const color = calculateColor(x);

  return { idx: k + 1, position: [x, y, z], color };
});
