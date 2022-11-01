import { rasterize_line, rasterize_Triangle, renderCoor } from './geometry';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { bunnyStr } from "./assets/bunny-obj"
const width = 500;
const height = 500;

const ctx = createCanvasRenderingContext2D({ width, height });
renderCoor(ctx, width, height);

const { position, normal } = getPosAndNormal(bunnyStr);
console.log(position)

const imageData = ctx.getImageData(0, 0, width, height);


ctx.putImageData(imageData, 0, 0);
