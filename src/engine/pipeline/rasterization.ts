import { Vector2, Vector4 } from 'three';
import { getTrangleUV, Trangle, lerp_Triangle_UV, rasterize_line } from '../geometry';

// 数值插值
const interp = (x1: number, x2: number, t: number) => {
  return x1 + (x2 - x1) * t;
};

// 向量插值
const vector_Interp = (z: Vector4, x1: Vector4, x2: Vector4, t: number) => {
  z.x = interp(x1.x, x2.x, t);
  z.y = interp(x1.y, x2.y, t);
  z.z = interp(x1.z, x2.z, t);
  z.w = 1.0;
};

// 顶点插值
const vertex_Interp = (z: Vertex_t, x1: Vertex_t, x2: Vertex_t, t: number) => {
  vector_Interp(z.pos, x1.pos, x2.pos, t);
  for (let key in x1.primaryData) {
    z.primaryData[key] = new Vector4();
    vector_Interp(z.primaryData[key], x1.primaryData[key], x2.primaryData[key], t);
  }
  z.rhw = interp(x1.rhw, x2.rhw, t);
};

// 透视除法
const vertex_division = (z: Vertex_t, x1: Vertex_t, x2: Vertex_t, w: number) => {
  const inv = 1 / w;
  z.pos.x = (x2.pos.x - x1.pos.x) * inv;
  z.pos.y = (x2.pos.y - x1.pos.y) * inv;
  z.pos.z = (x2.pos.z - x1.pos.z) * inv;
  z.pos.w = (x2.pos.w - x1.pos.w) * inv;
  z.rhw = (x2.rhw - x1.rhw) * inv;

  for (let key in x1.primaryData) {
    z.primaryData[key] = new Vector4();
    z.primaryData[key].x = (x2.primaryData[key].x - x1.primaryData[key].x) * inv;
    z.primaryData[key].y = (x2.primaryData[key].y - x1.primaryData[key].y) * inv;
    z.primaryData[key].z = (x2.primaryData[key].z - x1.primaryData[key].z) * inv;
    z.primaryData[key].w = (x2.primaryData[key].w - x1.primaryData[key].w) * inv;
  }
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

// 根据Y坐标算出左右两条边纵坐标等于Y的顶点
const trapezoid_edge_interp = (trap: Trapezoid_t, y: number) => {
  const s1 = trap.left.v2.pos.y - trap.left.v1.pos.y;
  const s2 = trap.right.v2.pos.y - trap.right.v1.pos.y;
  const t1 = (y - trap.left.v1.pos.y) / s1;
  const t2 = (y - trap.right.v1.pos.y) / s2;

  vertex_Interp(trap.left.v, trap.left.v1, trap.left.v2, t1);
  vertex_Interp(trap.right.v, trap.right.v1, trap.right.v2, t2);
};

// 根据左右两边的断点
const trapezoid_init_scan_line = (trap: Trapezoid_t, scanline: Scanline_t, y: number) => {
  const width = trap.right.v.pos.x - trap.left.v.pos.x;
  scanline.x = (trap.left.v.pos.x + 0.5) | 0;
  // TODO 为什么不直接用width
  scanline.w = ((trap.right.v.pos.x + 0.5) | 0) - scanline.x;
  scanline.y = y;
  scanline.v = trap.left.v;
  if (trap.left.v.pos.x >= trap.right.v.pos.x) scanline.w = 0;
  vertex_division(scanline.step, trap.left.v, trap.right.v, width);
};

const device_draw_scanline = (imageData: ImageData, zBuffer: Float32Array, scanline: Scanline_t) => {
  const { width, height, data } = imageData;

};

const render_trap = (imageData: ImageData, zBuffer: Float32Array, trap: Trapezoid_t) => {
  // 扫描线
  const scanline: Scanline_t = {
    x: 0,
    y: 0,
    w: 0,
    step: {
      pos: new Vector4(),
      rhw: 0,
      primaryData: {},
    },
  };
  const top = trap.top + 0.5;
  const bottom = trap.bottom + 0.5;
  for (let i = top; i < bottom; i++) {
    if (i >= 0 && i < imageData.height) {
      // 初始化trap两条边的Vertex
      trapezoid_edge_interp(trap, i + 0.5);
      trapezoid_init_scan_line(trap, scanline, i);
      device_draw_scanline(imageData, zBuffer, trap);
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
