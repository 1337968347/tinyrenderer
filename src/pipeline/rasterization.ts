import { vec3 } from 'gl-matrix';
import { inside_Triangle, Trangle, lerp_Triangle_UV } from '../geometry';

/**
 * 光栅化三角形
 * 离散化
 * @param trangle
 * @param width 离散的点
 * @param height
 * @returns trangleFragments 三角形光栅化后对应的片元数据
 */
const rasterize_Triangle = (trangle: Trangle, width: number, height: number) => {
  // 这个三角形的片元数据
  const trangleFragments = [];
  const [a, b, c] = trangle.points;
  // 加 0.5把 [-0.5, -0.5] 映射到 [0, 1]
  const A = vec3.clone([(a[0] + 0.5) * width, (a[1] + 0.5) * height, 0]);
  const B = vec3.clone([(b[0] + 0.5) * width, (b[1] + 0.5) * height, 0]);
  const C = vec3.clone([(c[0] + 0.5) * width, (c[1] + 0.5) * height, 0]);

  const minX = Math.min(A[0], B[0], C[0]);
  const maxX = Math.max(A[0], B[0], C[0]);
  const minY = Math.min(A[1], B[1], C[1]);
  const maxY = Math.max(A[1], B[1], C[1]);
  const pixTrangle = new Trangle([A, B, C]);
  for (let y = minY | 0; y < maxY; y++) {
    for (let x = minX | 0; x < maxX; x++) {
      // 加0.5 避免顶点取到三角形上
      const { u, v, inside } = inside_Triangle(pixTrangle, [x + 0.5, y + 0.5, 0]);
      if (inside) {
        trangleFragments.push({
          x,
          y,
          u,
          v,
          pos: lerp_Triangle_UV(trangle, u, v),
        });
      }
    }
  }

  return trangleFragments;
};

// 光栅化 生成片元数据
const rasterizationPipeline = (primitiveData: { [key: string]: Trangle[] }, Gl_Positions: Trangle[], width: number, height: number) => {
  // 帧缓存数据
  const FRAGMENTDATAS = new Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      FRAGMENTDATAS[y * width + x] = {
        primitiveData: {},
        pos: vec3.clone([x, y, -Infinity]),
        isHit: false,
      };
    }
  }

  // 每个图元
  for (let i = 0; i < Gl_Positions.length; i++) {
    const ndsTriangle = Gl_Positions[i];
    const primitiveVec3 = {};
    for (let key in primitiveData) {
      primitiveVec3[key] = primitiveData[key][i];
    }
    // 这个三角形光栅化后的片元数据
    const triangleFragments = rasterize_Triangle(ndsTriangle, width, height);
    // 每个片元
    for (let n = 0; n < triangleFragments.length; n++) {
      const temp = triangleFragments[n];
      const fragment = FRAGMENTDATAS[temp.y * width + temp.x];
      if (temp.pos[2] > fragment.pos[2]) {
        // const { u, v } = fragment;
        fragment.pos = temp.pos;
        fragment.primitiveData = {};
        fragment.isHit = true;
        for (let key in primitiveVec3) {
          fragment.primitiveData[key] = lerp_Triangle_UV(primitiveVec3[key], temp.u, temp.v);
        }
      }
    }
  }

  return FRAGMENTDATAS;
};

export { rasterizationPipeline };
