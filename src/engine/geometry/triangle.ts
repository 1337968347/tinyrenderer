import { Vector4 } from 'three';

// 三角形
class Trangle {
  /**
   *
   * @param points: Float32Array[3]
   */
  constructor(points: Vector4[]) {
    this.points = points;
  }

  points: Vector4[];
}

// /**
//  * 当前光栅化的点是否在三角形内部
//  * 同向法
//  * @param p 当前光栅化的点
//  * @param points 三角形的三个点
//  */
// const inside_Triangle = (p, points) => {
//   const [a, b, c] = points;

//   const ap = { x: p.x - a.x, y: p.y - a.y };
//   const bp = { x: p.x - b.x, y: p.y - b.y };
//   const cp = { x: p.x - c.x, y: p.y - c.y };

//   const ba = { x: a.x - b.x, y: a.y - b.y };
//   const ac = { x: c.x - a.x, y: c.y - a.y };
//   const cb = { x: b.x - c.x, y: b.y - c.y };

//   const z1 = ap.x * ba.y - ap.y * ba.x;
//   const z2 = cp.x * ac.y - cp.y * ac.x;
//   const z3 = bp.x * cb.y - bp.y * cb.x;

//   if ((z1 > 0 && z2 > 0 && z3 > 0) || (z1 < 0 && z2 < 0 && z3 < 0)) {
//     return true;
//   }
//   return false;
// };

/**
 * 获取点p在三角形中的重心坐标
 * @param trangle 三角形
 * @param p 三角形平面内一点p
 */
const getTrangleUV = (trangle: Trangle, p: Vector4) => {
  const [A, B, C] = trangle.points;
  const AP = { x: p.x - A.x, y: p.y - A.y };
  const AB = { x: B.x - A.x, y: B.y - A.y };
  const AC = { x: C.x - A.x, y: C.y - A.y };
  // 重心坐标 AP = u * AB + v* AC;
  // 面积
  return {
    u: (AP.x * AB.y - AB.x * AP.y) / (AC.x * AB.y - AB.x * AC.y),
    v: (AP.x * AC.y - AC.x * AP.y) / (AB.x * AC.y - AC.x * AB.y),
  };
};

/**
 * 根据三角形的顶点 以及U V值插值三角形
 * @param trangle
 * @param u
 * @param v
 * @return {Vector4}
 */
const lerp_Triangle_UV = (trangle: Trangle, u: number, v: number) => {
  const [A, B, C] = trangle.points;
  const t = 1 - u - v;
  return new Vector4(t * C.x + u * A.x + v * B.x, t * C.y + u * A.y + v * B.y, t * C.z + u * A.z + v * B.z, t * C.w + u * A.w + v * B.w);
};

/**
 * 顶点p 是否在三角形内
 * @param trangle
 * @param p
 */
const inside_Triangle = (trangle: Trangle, p: Vector4) => {
  const { u, v } = getTrangleUV(trangle, p);
  return { u, v, inside: 0 <= u && u <= 1 && v >= 0 && v <= 1 };
};

export { Trangle, inside_Triangle, lerp_Triangle_UV, getTrangleUV };
