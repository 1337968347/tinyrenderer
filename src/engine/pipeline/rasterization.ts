import { Vector2, Vector4 } from 'three';
import { getTrangleUV, Trangle, lerp_Triangle_UV, rasterize_line } from '../geometry';

const interp = (x1: number, x2: number, t: number) => {
  return x1 + (x2 - x1) * t;
};

const vector_Interp = (z: Vector4, x1: Vector4, x2: Vector4, t: number) => {
  z.x = interp(x1.x, x2.x, t);
  z.y = interp(x1.y, x2.y, t);
  z.z = interp(x1.z, x2.z, t);
  z.w = 1.0;
};

const vertex_Interp = (z: Vertex_t, x1: Vertex_t, x2: Vertex_t, t: number) => {
  vector_Interp(z.pos, x1.pos, x2.pos, t);
  for (let key in x1.primaryData) {
    z.primaryData[key] = new Vector4();
    vector_Interp(z.primaryData[key], x1.primaryData[key], x2.primaryData[key], t);
  }
  z.rhw = interp(x1.rhw, x2.rhw, t);
};

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

const trapezoid_edge_interp = (trap: Trapezoid_t, y: number) => {
  const s1 = trap.left.v2.pos.y - trap.left.v1.pos.y;
  const s2 = trap.right.v2.pos.y - trap.right.v1.pos.y;
  const t1 = (y - trap.left.v1.pos.y) / s1;
  const t2 = (y - trap.right.v1.pos.y) / s2;

  vertex_Interp(trap.left.v, trap.left.v1, trap.left.v2, t1);
  vertex_Interp(trap.right.v, trap.right.v1, trap.right.v2, t2);
};

const render_trap = (imageData: ImageData, trap: Trapezoid_t) => {
  const top = trap.top + 0.5;
  const bottom = trap.bottom + 0.5;
  for (let i = top; i < bottom; i++) {
    if (i >= 0 && i < imageData.height) {
      // 初始化trap两条边的Vertex
      trapezoid_edge_interp(trap, i);
      
    }
  }
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
    const traps: Trapezoid_t[] = trapezoid_Init_Triangle(tragle.points[0], tragle.points[1], tragle.points[2]);
  }

  return [];
};

export { rasterizationPipeline, FragmentData };
