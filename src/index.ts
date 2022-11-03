import { mat4 } from 'gl-matrix';
import { rasterize_line, rasterize_Triangle, renderCoor } from './geometry';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { vertPipeline, vertShader } from './pipeline';
import { bunnyStr } from './assets/bunny-obj';

const width = 500;
const height = 500;

const ctx = createCanvasRenderingContext2D({ width, height });
// renderCoor(ctx, width, height);

const { position, normal } = getPosAndNormal(bunnyStr);

const modelMatrix = mat4.identity(mat4.create());
const projectionMatrix = mat4.identity(mat4.create());
console.log(position, normal);
const 

const imageData = ctx.getImageData(0, 0, width, height);

ctx.putImageData(imageData, 0, 0);
