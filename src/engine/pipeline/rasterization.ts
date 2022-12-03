import { Vector4 } from 'three';
import { inside_Triangle, Trangle, lerp_Triangle_UV } from '../geometry';

const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

type rasterizationPipelineProps = {
  primitiveData: PrimitiveData;
  glPosition: Trangle[];
  width: number;
  height: number;
  zBuffer: Float32Array;
};

/**
 * 光栅化三角形
 * 离散化
 * @param glPosition nds 标准成像空间 三角形
 * @param i 三角形下标
 * @param width 离散的点
 * @param height
 * @returns trangleFragments 三角形光栅化后对应的片元数据
 */
const rasterize_Triangle = (glPosition: Trangle[], i: number, width: number, height: number) => {
  // 这个三角形的片元数据
  const trangleFragments: FragmentData[] = [];
  const [a, b, c] = glPosition[i].points;
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
          // 当前像素坐标值
          x,
          y,
          // 当前片元在当前三角形中的uv值
          u,
          v,
          trangleIdx: 0,
          // 深度缓存
          z: (1 - u - v) * c.z + u * a.z + v * b.z,
        });
      }
    }
  }

  return trangleFragments;
};

/**
 * 光栅化 生成片元数据
 * @param props
 * @returns
 */
const rasterizationPipeline = (props: rasterizationPipelineProps): FragmentData[] => {
  const { primitiveData, glPosition, width, height, zBuffer } = props;
  zBuffer.fill(-Infinity);
  // 帧缓存数据
  const FRAGMENTDATAS: FragmentData[] = new Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      FRAGMENTDATAS[y * height + x] = {
        x,
        y,
        u: 0,
        v: 0,
        trangleIdx: -1,
      };
    }
  }

  // 每个图元
  for (let i = 0; i < glPosition.length; i++) {
    // 这个三角形光栅化后的片元数据
    const triangleFragments = rasterize_Triangle(glPosition, i, width, height);
    // 每个片元
    for (let n = 0; n < triangleFragments.length; n++) {
      const temp = triangleFragments[n];
      const offset = temp.y * width + temp.x;
      const fragment = FRAGMENTDATAS[offset];
      // z深度测试 并且保存下标以及uv值
      if (temp.z > zBuffer[offset]) {
        zBuffer[offset] = temp.z;
        fragment.u = temp.u;
        fragment.v = temp.v;
        fragment.trangleIdx = i;
      }
    }
  }

  // 插值片元数据
  for (let i = 0; i < FRAGMENTDATAS.length; i++) {
    const fragmentItem = FRAGMENTDATAS[i];
    if (fragmentItem.trangleIdx !== -1) {
      fragmentItem.primitiveData = {};
      const { u, v, trangleIdx } = fragmentItem;
      for (const key in primitiveData) {
        fragmentItem.primitiveData[key] = lerp_Triangle_UV(primitiveData[key][trangleIdx], u, v);
      }
    }
  }

  return FRAGMENTDATAS;
};

export { rasterizationPipeline, FragmentData };
