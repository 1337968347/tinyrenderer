class Vector {
  x: number;
  y: number;
  z: number;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Line {
  sp: Vector;
  ep: Vector;
  constructor(sp: Vector, ep: Vector) {
    this.sp = sp;
    this.ep = ep;
  }
}

const coor2index = (x, y, width, height) => {
  y *= -1;
  y += (height / 2) | 0;
  x += (width / 2) | 0;
  return (y * width + x) * 4;
};

// 绘制坐标系
const renderCoor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.strokeStyle = '#ff0000';
  ctx.moveTo(0, (height / 2) | 0);
  ctx.lineTo(width, (height / 2) | 0);
  ctx.stroke();

  ctx.moveTo((width / 2) | 0, 0);
  ctx.lineTo((width / 2) | 0, height);
  ctx.stroke();
};

// 直线光栅化算法 y = mx + y0
const renderLine = (x0: number, y0: number, x1: number, y1: number, imageData: ImageData) => {
  const { data, width, height } = imageData;
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

  const plot = (x: number, y: number) => {
    const index = coor2index(x, y, width, height);
    data[index + 3] = 255;
  };

  for (let x = x0; x < x1; x++) {
    if (steep) {
      plot(y, x);
    } else {
      plot(x, y);
    }
    // dda 数字微分
    error -= deltaY;
    if (error < 0) {
      y += yStep;
      error += deltaX;
    }
  }
};

export { Line, Vector, renderLine, renderCoor };
