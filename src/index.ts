import { mat4 } from 'gl-matrix';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { vertPipeline, vertShader, trangleMake } from './pipeline';
import { bunnyStr } from './assets/bunny-obj';

const width = 500;
const height = 500;

const ctx = createCanvasRenderingContext2D({ width, height });
// renderCoor(ctx, width, height);

const attributes = getPosAndNormal(bunnyStr);

const modelMatrix = mat4.identity(mat4.create());
const projectionMatrix = mat4.identity(mat4.create());
const uniforms = { modelMatrix, projectionMatrix };
// 顶点着色器
const { varyings, gl_positions } = vertPipeline(attributes, uniforms, vertShader);
// 图元组装
const primitiveData = trangleMake(varyings);


console.log(varyings, gl_positions, primitiveData);
const imageData = ctx.getImageData(0, 0, width, height);

ctx.putImageData(imageData, 0, 0);
