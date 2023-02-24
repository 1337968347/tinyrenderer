import { Vector4 } from 'three';
// import { BBox } from '../geometry';

const primitivePipeline = (verts: Vertex_t[], width: number, height: number) => {
  const cropVerts: Vertex_t[] = [];
  for (let i = 0; i < verts.length; i += 3) {
    if (transform_check_cvv(verts[i].pos) && transform_check_cvv(verts[i + 1].pos) && transform_check_cvv(verts[i + 2].pos)) {
      transform_homogenize(verts[i], width, height);
      transform_homogenize(verts[i + 1], width, height);
      transform_homogenize(verts[i + 2], width, height);

      if (!backCull(verts[i].pos, verts[i + 1].pos, verts[i + 2].pos)) {
        continue;
      }
      cropVerts.push(verts[i]);
      cropVerts.push(verts[i + 1]);
      cropVerts.push(verts[i + 2]);
    }
  }
  return cropVerts;
};

const transform_check_cvv = (v: Vector4) => {
  const w = v.w;
  let check = 0;
  if (v.z < 0) check |= 1;
  if (v.z > w) check |= 2;
  if (v.x < -w) check |= 4;
  if (v.x > w) check |= 8;
  if (v.y < -w) check |= 16;
  if (v.y > w) check |= 32;
  return check === 0;
};

// 归一化，得到屏幕坐标
const transform_homogenize = (v: Vertex_t, width: number, height: number) => {
  const rhw = 1.0 / v.pos.w;
  v.pos.x = (v.pos.x * rhw + 1.0) * width * 0.5;
  v.pos.y = (v.pos.y * rhw + 1.0) * height * 0.5;
  v.pos.z = v.pos.z * rhw;
  v.rhw = v.pos.w;
  v.pos.w = 1.0;
};

// // 视锥体剔除
// const frustumCull = (a: Vertex_t, b: Vertex_t, c: Vertex_t, bbox: BBox): boolean => {
//   if (!bbox.inside(a.pos)) {
//     return false;
//   }
//   if (!bbox.inside(b.pos)) {
//     return false;
//   }
//   if (!bbox.inside(c.pos)) {
//     return false;
//   }
//   return true;
// };

// 背面剔除
const backCull = (a: Vector4, b: Vector4, c: Vector4) => {
  const ax = b.x - a.x;
  const ay = b.y - a.y;
  const bx = c.x - b.x;
  const by = c.y - b.y;
  const z = ax * by - ay * bx;
  return z > 0;
};

export { primitivePipeline };
