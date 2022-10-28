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

export { coor2index, renderCoor };
