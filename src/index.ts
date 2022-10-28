import { rasterize_line, rasterize_Triangle, renderCoor } from './geometry';
import { createCanvasRenderingContext2D } from './utils';
const width = 500;
const height = 500;

const ctx = createCanvasRenderingContext2D({ width, height });
renderCoor(ctx, width, height);

const imageData = ctx.getImageData(0, 0, width, height);

rasterize_line(0, 0, -200, 200, imageData);
rasterize_line(0, 0, 200, 200, imageData);
rasterize_line(0, 0, 200, -200, imageData);
rasterize_line(0, 0, -200, -200, imageData);
rasterize_line(0, 0, 0, -200, imageData);

const p1 = { x: 0, y: 200 };
const p2 = { x: 200, y: 0 };
const p3 = { x: -200, y: 0 };

rasterize_Triangle([p1, p2, p3], imageData);

ctx.putImageData(imageData, 0, 0);
