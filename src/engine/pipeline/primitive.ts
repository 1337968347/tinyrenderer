import { Vector4, Vector3 } from 'three';
import { Trangle, BBox } from '../geometry';

// 图元组装
// 拼成三角形->
const primitiveMakePipeline = (attribute: { [key: string]: Vector4[] }, gl_positions: Vector4[]) => {
  // 透视除法
  const tragles = makeTrangle(attribute, gl_positions);
  // 裁剪处理 (背面剔除, 视锥体剔除)
  croppingPipeline(tragles);
  return tragles;
};

// 顶点拼成三角形
const makeTrangle = (attribute: { [key: string]: Vector4[] }, gl_positions: Vector4[]) => {
  const tragles: Trangle[] = [];
  let tragle: Vertex_t[] = [];
  for (let i = 0; i < gl_positions.length; i++) {
    const primaryData = {};
    for (let key in attribute) {
      primaryData[key] = attribute[key][i];
    }
    const vert: Vertex_t = { rhw: gl_positions[i].w, pos: gl_positions[i], primaryData };
    tragle.push(vert);
    if (tragle.length == 3) {
      tragles.push(new Trangle(tragle));
      tragle = [];
    }
  }
  return tragles;
};

// 视锥体剔除  背面剔除
const croppingPipeline = (tragles: Trangle[]) => {
  const bbox = new BBox([new Vector3(-0.5, -0.5, -0.5), new Vector3(0.5, 0.5, 0.5)]);

  for (let i = 0; i < tragles.length; i++) {
    // 通过 视锥体剔除 和 背面剔除
    if (!frustumCull(tragles[i], bbox) || !backCull(tragles[i])) {
      tragles.splice(i, 1);
    }
  }
};

// 视锥体剔除
const frustumCull = (trangle: Trangle, bbox: BBox): boolean => {
  for (let i = 0; i < 3; i++) {
    if (!bbox.inside(trangle.points[i].pos)) {
      return false;
    }
  }
  return true;
};

// 背面剔除
const backCull = (gl_position: Trangle) => {
  const [a, b, c] = gl_position.points;
  const ax = b.pos.x - a.pos.x;
  const ay = b.pos.y - a.pos.y;
  const bx = c.pos.x - b.pos.x;
  const by = c.pos.y - b.pos.y;
  const z = ax * by - ay * bx;
  return z > 0;
};

export { primitiveMakePipeline };
