import { vec3 } from 'gl-matrix';
import { inside_Triangle, Trangle } from '../geometry';

const WIDTH = 512;
const HEIGHT = 512;
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
      const { u, v, inside } = inside_Triangle(pixTrangle, [x + 0.5, y + 0.5, 0]);
      if (inside) {
        trangleFragments.push({
          x,
          y,
          u,
          v,
          pixTrangle,
        });
      }
    }
  }

  return trangleFragments;
};

// 光栅化 生成片元数据
const rasterizationPipeline = (primitiveData: { [key: string]: Trangle[] }, Gl_Positions: Trangle[]) => {
  const fragmentDatas = new Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      fragmentDatas[y * WIDTH + x] = {
        primitiveData: {},
        ndcPos: { x, y, z: -Infinity },
      };
    }
  }

  for (let i = 0; i < Gl_Positions.length; i++) {
    const ndsTriangle = Gl_Positions[i];
    const triangleFragments = rasterize_Triangle(ndsTriangle, WIDTH, HEIGHT);
    console.log(triangleFragments);
  }

  return fragmentDatas;
};

export { rasterizationPipeline };
