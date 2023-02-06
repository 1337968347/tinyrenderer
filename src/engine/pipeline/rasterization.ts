import { Vector2, Vector4 } from 'three';
import { getTrangleUV, Trangle, lerp_Triangle_UV, rasterize_line } from '../geometry';

/**
 * 将大三角形划分成 0 - 2 个平底 | 平顶 三角形
 */
const trapezoid_Init_Triangle = (p1: Vertex_t, p2: Vertex_t, p3: Vertex_t) => {
  let p: Vertex_t;

  if (p1.pos.y > p2.pos.y) {
    (p = p1), (p1 = p2), (p2 = p);
  }
  if (p1.pos.y > p3.pos.y) {
    (p = p1), (p1 = p3), (p3 = p);
  }
  if (p2.pos.y > p3.pos.y) {
    (p = p2), (p2 = p3), (p3 = p);
  }
  if (p1.pos.y == p2.pos.y && p1.pos.y == p3.pos.y) return [];
  if (p1.pos.x == p2.pos.x && p1.pos.x == p3.pos.x) return [];

  p1 = { ...p1 };
  p2 = { ...p2 };
  p3 = { ...p3 };

  // 下三角形
  if (p1.pos.y == p2.pos.y) {
    if (p1.pos.x > p2.pos.x) {
      p = p1;
      p1 = p2;
      p2 = p;
    }
    const trap: Trapezoid_t = {
      top: p1.pos.y,
      bottom: p3.pos.y,
      left: { v1: p1, v2: p2 },
      right: { v1: p1, v2: p3 },
    };

    return [trap];
  }

  // 上三角形
  if (p2.pos.y == p3.pos.y) {
    if (p2.pos.x > p3.pos.x) {
      p = p2;
      p2 = p3;
      p3 = p;
    }
    const trap: Trapezoid_t = {
      top: p1.pos.y,
      bottom: p2.pos.y,
      left: { v1: p1, v2: p2 },
      right: { v1: p1, v2: p3 },
    };
    return [trap];
  }

  const trap: Trapezoid_t[] = [];
  const x = (p3.pos.x - p1.pos.x) * ((p3.pos.y - p1.pos.y) / (p2.pos.y - p1.pos.y));
  let topTrap: Trapezoid_t, bottomTrap: Trapezoid_t;

  //      .
  //
  //        .
  // .
  if (x > p3.pos.x) {
    topTrap = { top: p1.pos.y, bottom: p2.pos.y, left: { v1: p1, v2: p3 }, right: { v1: p1, v2: p2 } };
    bottomTrap = { top: p2.pos.y, bottom: p3.pos.y, left: { v1: p1, v2: p3 }, right: { v1: p2, v2: p3 } };
  } else {
    //      .
    //
    //   .
    //             .
    topTrap = { top: p1.pos.y, bottom: p2.pos.y, left: { v1: p1, v2: p2 }, right: { v1: p1, v2: p3 } };
    bottomTrap = { top: p2.pos.y, bottom: p3.pos.y, left: { v1: p2, v2: p3 }, right: { v1: p1, v2: p3 } };
  }

  return [topTrap, bottomTrap];
};

/**
 * 光栅化 生成片元数据
 * @param props
 * @returns
 */
const rasterizationPipeline = (props: rasterizationPipelineProps): FragmentData[] => {
  const { tragles, zBuffer, FRAGMENTDATAS, imageData, fragShader } = props;

  // 每个图元
  for (let i = 0; i < tragles.length; i++) {
    const tragle = tragles[i];
  }

  return [];
};

export { rasterizationPipeline, FragmentData };
