import { Vector4 } from 'three';
import { State } from "../"

// 视锥体裁剪
const check_CVV = (verts: Vertex_t[], i: number) => {
  if (!State.state['use-cvvCull']) { return true }
  if (transform_check_cvv(verts[i].pos) && transform_check_cvv(verts[i + 1].pos) && transform_check_cvv(verts[i + 2].pos)) { return true }
  return false
}

// 背面剔除
const check_BackCull = (verts: Vertex_t[], i: number) => {
  if (!State.state['use-backCull']) { return true }
  if (backCull(verts[i].pos, verts[i + 1].pos, verts[i + 2].pos)) { return true }
  return true
}

const primitivePipeline = (verts: Vertex_t[], width: number, height: number) => {
  const cropVerts: Vertex_t[] = [];
  for (let i = 0; i < verts.length; i += 3) {

    // 视锥体裁剪
    if (!check_CVV(verts, i)) {
      continue;
    }

    // 透视除法
    perspectiveDivide(verts[i]);
    perspectiveDivide(verts[i + 1]);
    perspectiveDivide(verts[i + 2]);

    // 背面剔除
    if (!check_BackCull(verts, i)) {
      continue
    }

    // 屏幕空间 
    transform_homogenize(verts[i], width, height);
    transform_homogenize(verts[i + 1], width, height);
    transform_homogenize(verts[i + 2], width, height);

    cropVerts.push(verts[i]);
    cropVerts.push(verts[i + 1]);
    cropVerts.push(verts[i + 2]);
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

const perspectiveDivide = (v: Vertex_t) => {
  const rhw = 1.0 / v.pos.w;
  v.pos.x = v.pos.x * rhw;
  v.pos.y = v.pos.y * rhw;
  v.pos.z = v.pos.z * rhw;
  v.rhw = rhw;
  v.pos.w = 1.0;
}

// 归一化，得到屏幕坐标
const transform_homogenize = (v: Vertex_t, width: number, height: number) => {
  v.pos.x = (v.pos.x + 1.0) * width * 0.5;
  v.pos.y = (1.0 - v.pos.y) * height * 0.5;
};

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
