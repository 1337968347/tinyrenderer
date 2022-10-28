import { coor2index } from './index';

/**
 * 当前光栅化的点是否在三角形内部
 * @param p 当前光栅化的点
 * @param points 三角形的三个点
 */
const inside_Triangle = (p, points) => {
  const [a, b, c] = points;

  const ap = { x: p.x - a.x, y: p.y - a.y };
  const bp = { x: p.x - b.x, y: p.y - b.y };
  const cp = { x: p.x - c.x, y: p.y - c.y };

  const ba = { x: a.x - b.x, y: a.y - b.y };
  const ac = { x: c.x - a.x, y: c.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };

  const z1 = ap.x * ba.y - ap.y * ba.x;
  const z2 = cp.x * ac.y - cp.y * ac.x;
  const z3 = bp.x * cb.y - bp.y * cb.x;

  if ((z1 > 0 && z2 > 0 && z3 > 0) || (z1 < 0 && z2 < 0 && z3 < 0)) {
    return true;
  }
  return false;
};

/**
 * 光栅化三角形
 * @param points {x: number, y: number}[3]
 * @param imageData
 */
const rasterize_Triangle = (points, imageData: ImageData) => {
  const [a, b, c] = points;
  const { width, height, data } = imageData;
  const minX = Math.min(a.x, b.x, c.x, 0);
  const maxX = Math.max(a.x, b.x, c.x);
  const minY = Math.min(a.y, b.y, c.y);
  const maxY = Math.max(a.y, b.y, c.y);
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      const p = { x: x + 0.5, y: y + 0.5 };
      if (inside_Triangle(p, points)) {
        data[coor2index(x, y, width, height) + 3] = 200;
      }
    }
  }
};
export { rasterize_Triangle };
