import { Vector4 } from 'three';

const newVertex = () => {
  const vert: Vertex_t = { pos: new Vector4(), rhw: 0, primaryData: {} };
  return vert;
};

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

const vertex_add = (y: Vertex_t, x: Vertex_t) => {
  y.pos.x += x.pos.x;
  y.pos.y += x.pos.y;
  y.pos.z += x.pos.z;
  y.pos.w += x.pos.w;
  y.rhw += x.rhw;

  for (let key in y.primaryData) {
    y.primaryData[key].x += x.primaryData[key].x;
    y.primaryData[key].y += x.primaryData[key].y;
    y.primaryData[key].z += x.primaryData[key].z;
    y.primaryData[key].w += x.primaryData[key].w;
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
      left: { v1: p1, v2: p2, v: newVertex() },
      right: { v1: p1, v2: p3, v: newVertex() },
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
      left: { v1: p1, v2: p2, v: newVertex() },
      right: { v1: p1, v2: p3, v: newVertex() },
    };
    return [trap];
  }

  const k = (p3.pos.y - p1.pos.y) / (p2.pos.y - p1.pos.y);
  const x = p1.pos.x + (p2.pos.x - p1.pos.x) * k;
  let topTrap: Trapezoid_t, bottomTrap: Trapezoid_t;

  //      .
  //
  //        .
  // .
  if (x > p3.pos.x) {
    topTrap = { top: p1.pos.y, bottom: p2.pos.y, left: { v1: p1, v2: p3, v: newVertex() }, right: { v1: p1, v2: p2, v: newVertex() } };
    bottomTrap = { top: p2.pos.y, bottom: p3.pos.y, left: { v1: p1, v2: p3, v: newVertex() }, right: { v1: p2, v2: p3, v: newVertex() } };
  } else {
    //      .
    //
    //   .
    //             .
    topTrap = { top: p1.pos.y, bottom: p2.pos.y, left: { v1: p1, v2: p2, v: newVertex() }, right: { v1: p1, v2: p3, v: newVertex() } };
    bottomTrap = { top: p2.pos.y, bottom: p3.pos.y, left: { v1: p2, v2: p3, v: newVertex() }, right: { v1: p1, v2: p3, v: newVertex() } };
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
  scanline.w = ((trap.right.v.pos.x + 0.5) | 0) - scanline.x;
  scanline.y = y;
  scanline.v = trap.left.v;
  if (trap.left.v.pos.x >= trap.right.v.pos.x) scanline.w = 0;
  // 初始化step
  vertex_division(scanline.step, trap.left.v, trap.right.v, width);
};

const device_draw_scanline = (imageData: ImageData, zBuffer: Float32Array, scanline: Scanline_t, uniforms: uniformsProp, fragShader: FragShader) => {
  const { width, data } = imageData;
  let { x, w } = scanline;
  let gl_FragColor = new Vector4();
  // 下标偏移
  const idx = (scanline.y | 0) * width;
  for (; w > 0; x++, w--) {
    if (x > 0 && x < width) {
      const offset = idx + x;
      if (scanline.v.rhw > zBuffer[offset]) {
        zBuffer[offset] = scanline.v.rhw;
        gl_FragColor = new Vector4();
        fragShader(scanline.v, uniforms, gl_FragColor);
        const idxx = offset << 2;
        data[idxx] = gl_FragColor.x;
        data[idxx + 1] = gl_FragColor.y;
        data[idxx + 2] = gl_FragColor.z;
        data[idxx + 3] = gl_FragColor.w;
      }
    }
    vertex_add(scanline.v, scanline.step);
    if (x > width) break;
  }
};

const render_trap = (imageData: ImageData, zBuffer: Float32Array, trap: Trapezoid_t, uniforms: uniformsProp, fragShader: FragShader) => {
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
  const top = (trap.top + 0.5) | 0;
  const bottom = (trap.bottom + 0.5) | 0;
  for (let i = top; i < bottom; i++) {
    if (i >= 0 && i < imageData.height) {
      // 初始化trap两条边的Vertex
      trapezoid_edge_interp(trap, i + 0.5);
      trapezoid_init_scan_line(trap, scanline, i);
      device_draw_scanline(imageData, zBuffer, scanline, uniforms, fragShader);
    }
  }
};

/**
 * 光栅化 生成片元数据
 * @param props
 * @returns
 */
const rasterizationPipeline = (props: rasterizationPipelineProps) => {
  const { verts, zBuffer, imageData, fragShader, uniforms } = props;
  // 每个图元
  for (let i = 0; i < verts.length; i += 3) {
    // vertex_rhw_init(verts[i]);
    // vertex_rhw_init(verts[i + 1]);
    // vertex_rhw_init(verts[i + 2]);
    const traps: Trapezoid_t[] = trapezoid_Init_Triangle(verts[i], verts[i + 1], verts[i + 2]);
    for (let j = 0; j < traps.length; j++) {
      render_trap(imageData, zBuffer, traps[j], uniforms, fragShader);
    }
  }
};

export { rasterizationPipeline };
