import { Vector } from './index';

class Line {
  sp: Vector;
  ep: Vector;
  constructor(sp: Vector, ep: Vector) {
    this.sp = sp;
    this.ep = ep;
  }
}

// 直线光栅化算法 y = mx + y0
const rasterize_line = (x0: number, y0: number, x1: number, y1: number) => {
  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  let temp;
  // 是否m >1
  if (steep) {
    // swap(x0, y0)
    temp = x0;
    x0 = y0;
    y0 = temp;
    // swap(x1, y1)
    temp = x1;
    x1 = y1;
    y1 = temp;
  }
  if (x0 > x1) {
    // swap(x0, x1);
    temp = x0;
    x0 = x1;
    x1 = temp;
    // swap(y0, y1);
    temp = y0;
    y0 = y1;
    y1 = temp;
  }
  const deltaX = x1 - x0;
  const deltaY = Math.abs(y1 - y0);
  let error = deltaX / 2;
  let yStep;
  let y = y0;
  if (y0 < y1) {
    yStep = 1;
  } else {
    yStep = -1;
  }

  const linePlots: { x: number; y: number }[] = [];
  const plot = (x: number, y: number) => {
    linePlots.push({ x: x | 0, y: y | 0 });
  };

  for (let x = x0; x < x1; x++) {
    if (steep) {
      plot(y, x);
    } else {
      plot(x, y);
    }
    // DDA
    error -= deltaY;
    if (error < 0) {
      y += yStep;
      error += deltaX;
    }
  }

  return linePlots;
};

export { Line, rasterize_line };
