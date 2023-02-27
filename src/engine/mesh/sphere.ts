export const d3_sphere = (r = 1, n = 200, m = 100) => {
  // [0, 2pi]
  const vertices = [];
  const norms = [];
  const texCoords = [];
  for (let y = 0; y <= m; y++) {
    for (let x = 0; x <= n; x++) {
      const u = x / n;
      const v = y / m;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      const py = Math.cos(phi) * r;
      const px = Math.sin(phi) * Math.cos(theta) * r;
      const pz = Math.sin(phi) * Math.sin(theta) * r;
      // colors.push(Math.random(), Math.random(), Math.random(), 1)
      texCoords.push(1 - u, v, 0.0);
      vertices.push(px, py, pz);
      norms.push(px, py, pz);
    }
  }
  return { vertices, norms, texCoords };
};
