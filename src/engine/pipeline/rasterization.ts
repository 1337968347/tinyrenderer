import { Vector4 } from 'three';
import { inside_Triangle, Trangle, lerp_Triangle_UV, rasterize_line } from '../geometry';

type rasterizationPipelineProps = {
  primitiveData: PrimitiveData;
  glPosition: Trangle[];
  width: number;
  height: number;
  zBuffer: Float32Array;
};

/**
 * 光栅化三角形
 * 包围盒 + 相邻叉乘判断Z
 * 离散化
 * @param glPosition nds 标准成像空间 三角形
 * @param i 三角形下标
 * @param width 离散的点
 * @param height
 * @returns trangleFragments 三角形光栅化后对应的片元数据
 */
// const rasterize_TriangleOld = (glPosition: Trangle[], i: number, width: number, height: number) => {
//   // 这个三角形的片元数据
//   const trangleFragments: FragmentData[] = [];
//   const [a, b, c] = glPosition[i].points;
//   // 加 0.5把 [-0.5, -0.5] 映射到 [0, 1]
//   const A = new Vector4((a.x + 0.5) * width, (a.y + 0.5) * height, 0, 1.0);
//   const B = new Vector4((b.x + 0.5) * width, (b.y + 0.5) * height, 0, 1.0);
//   const C = new Vector4((c.x + 0.5) * width, (c.y + 0.5) * height, 0, 1.0);

//   const minX = clamp(0, Math.min(A.x, B.x, C.x), width);
//   const maxX = clamp(minX, Math.max(A.x, B.x, C.x), width);
//   const minY = clamp(0, Math.min(A.y, B.y, C.y), height);
//   const maxY = clamp(minY, Math.max(A.y, B.y, C.y), height);

//   const pixTrangle = new Trangle([A, B, C]);
//   for (let y = minY | 0; y < maxY; y++) {
//     for (let x = minX | 0; x < maxX; x++) {
//       // 加0.5 避免顶点取到三角形上
//       const { u, v, inside } = inside_Triangle(pixTrangle, new Vector4(x, y, 0, 1));
//       if (inside) {
//         trangleFragments.push({
//           // 当前像素坐标值
//           x,
//           y,
//           // 当前片元在当前三角形中的uv值
//           u,
//           v,
//           trangleIdx: 0,
//           // 深度缓存
//           z: (1 - u - v) * c.z + u * a.z + v * b.z,
//         });
//       }
//     }
//   }

//   return trangleFragments;
// };

// y-x 算法(y-x algorithm)，
// 该算法为每条扫描线创建一个吊桶。随着算法对多边形边线的处理，边线与扫描线的交点放置在相应的吊桶中。
// 在每个吊桶中，使用插入排序方法对每条扫描线上的交点序列的x坐标值进行排序
const yx = (A: Vector4, B: Vector4, C: Vector4, trangleIdx: number) => {
  const plotAB = rasterize_line(A.x, A.y, B.x, B.y);
  const plotAC = rasterize_line(A.x, A.y, C.x, C.y);
  const plotBC = rasterize_line(B.x, B.y, C.x, C.y);
  // 三角形的边框点
  const borderPlots = plotAB.concat(plotAC).concat(plotBC);
  let minY = Infinity;
  let maxY = -Infinity;
  borderPlots.map(plot => {
    minY = Math.min(plot.y, minY);
    maxY = Math.max(plot.y, maxY);
  });

  let startY = minY;

  // y - x 二维链表
  const linkList = new Array(maxY - minY + 1);
  for (let i = 0; i < linkList.length; i++) {
    linkList[i] = [];
  }

  borderPlots.map(plot => {
    const { x, y } = plot;
    const curY = y;

    const yIdx = curY - startY;
    if (linkList[yIdx].length == 0) {
      linkList[yIdx].push(x);
    } else if (linkList[yIdx].length == 1) {
      //  按照x的大小排序
      if (linkList[yIdx][0] > x) {
        linkList[yIdx] = [x, linkList[yIdx][0]];
      } else if (linkList[yIdx][0] < x) {
        linkList[yIdx] = [linkList[yIdx][0], x];
      } else {
        // 相等不处理
      }
    }
  });
  const pixTrangle = new Trangle([A, B, C]);
  // 针对Y - X 链表 生成片元数据
  // 这个三角形的片元数据 不带UV
  const trangleFragments: FragmentData[] = [];
  for (let i = 0; i < linkList.length; i++) {
    if (linkList[i].length == 1) {
      continue;
    }
    const [x1, x2] = linkList[i];

    for (let j = x1; j <= x2; j++) {
      const x = j;
      const y = i + startY;
      const { u, v, inside } = inside_Triangle(pixTrangle, new Vector4(x, y, 0, 1));
      if (inside) {
        trangleFragments.push({
          x,
          y,
          trangleIdx,
          u,
          v,
        });
      }
    }
  }
  return trangleFragments;
};

/**
 * 三角形光栅化
 * 扫描线填充算法
 * @param glPosition nds 标准成像空间 三角形
 * @param i 三角形下标
 * @param width
 * @param height
 * @returns trangleFragments 三角形光栅化后对应的片元数据
 */
const rasterize_Triangle = (glPosition: Trangle[], trangleIdx: number, width: number, height: number) => {
  const [a, b, c] = glPosition[trangleIdx].points;
  // 加 0.5把 [-0.5, -0.5] 映射到 [0, 1]
  const A = new Vector4((a.x + 0.5) * width, (a.y + 0.5) * height, 0, 1.0);
  const B = new Vector4((b.x + 0.5) * width, (b.y + 0.5) * height, 0, 1.0);
  const C = new Vector4((c.x + 0.5) * width, (c.y + 0.5) * height, 0, 1.0);

  const trangleFragments = yx(A, B, C, trangleIdx);

  return trangleFragments;
};

/**
 * 光栅化 生成片元数据
 * @param props
 * @returns
 */
const rasterizationPipeline = (props: rasterizationPipelineProps): FragmentData[] => {
  const { primitiveData, glPosition, width, height, zBuffer } = props;

  // 帧缓存数据
  const FRAGMENTDATAS: FragmentData[] = new Array(zBuffer.length);
  for (let i = 0; i < zBuffer.length; i++) {
    FRAGMENTDATAS[i] = {
      u: 0,
      v: 0,
      trangleIdx: -1,
    };
  }

  // 每个图元
  for (let i = 0; i < glPosition.length; i++) {
    // 这个三角形光栅化后的片元数据
    const trangleFragments = rasterize_Triangle(glPosition, i, width, height);
    // 每个片元
    for (let n = 0; n < trangleFragments.length; n++) {
      const temp = trangleFragments[n];
      const { u, v } = temp;
      const [a, b, c] = glPosition[temp.trangleIdx].points;
      const pixZ = (1 - u - v) * c.z + u * a.z + v * b.z;
      const offset = temp.y * width + temp.x;
      const fragment = FRAGMENTDATAS[offset];
      // z深度测试 并且保存下标以及uv值
      if (pixZ > zBuffer[offset]) {
        zBuffer[offset] = pixZ;
        fragment.u = u;
        fragment.v = v;
        fragment.trangleIdx = i;
      }
    }
  }

  // 插值片元数据
  for (let i = 0; i < FRAGMENTDATAS.length; i++) {
    if (zBuffer[i] !== -Infinity) {
      const fragmentItem = FRAGMENTDATAS[i];
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
