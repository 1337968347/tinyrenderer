import { Vector4 } from 'three';
import { inside_Triangle, Trangle, lerp_Triangle_UV } from '../geometry';

const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

type FragmentData = {
  x: number;
  y: number;
  pos: Vector4;
  isHit: boolean;
  primitiveData: { [key: string]: Vector4 };
};
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
  const A = new Vector4((a.x + 0.5) * width, (a.y + 0.5) * height, 0, 1.0);
  const B = new Vector4((b.x + 0.5) * width, (b.y + 0.5) * height, 0, 1.0);
  const C = new Vector4((c.x + 0.5) * width, (c.y + 0.5) * height, 0, 1.0);

  const minX = clamp(0, Math.min(A.x, B.x, C.x), width);
  const maxX = clamp(minX, Math.max(A.x, B.x, C.x), width);
  const minY = clamp(0, Math.min(A.y, B.y, C.y), height);
  const maxY = clamp(minY, Math.max(A.y, B.y, C.y), height);

  const pixTrangle = new Trangle([A, B, C]);
  for (let y = minY | 0; y < maxY; y++) {
    for (let x = minX | 0; x < maxX; x++) {
      // 加0.5 避免顶点取到三角形上
      const { u, v, inside } = inside_Triangle(pixTrangle, new Vector4(x, y, 0, 1));
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
const rasterizationPipeline = (primitiveData: { [key: string]: Trangle[] }, Gl_Positions: Trangle[], width: number, height: number): FragmentData[] => {
  // 帧缓存数据
  const FRAGMENTDATAS: FragmentData[] = new Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      FRAGMENTDATAS[y * width + x] = {
        primitiveData: {},
        pos: new Vector4(x, y, -Infinity, 1.0),
        isHit: false,
        x,
        y,
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
      if (temp.pos.z > fragment.pos.z) {
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

export { rasterizationPipeline, FragmentData };
