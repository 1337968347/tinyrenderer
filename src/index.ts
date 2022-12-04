import { Matrix4 } from 'three';
import { Render2FrameBuffer } from './engine';
import { getPosAndNormal } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { vertShader, fragShader } from './shader';

const canvasEl = document.querySelector('canvas');
const attributes = getPosAndNormal(bunnyStr);

// 模型变换矩阵
const modelMatrix = new Matrix4().makeTranslation(0, -0.3, 0.0);
modelMatrix.multiply(new Matrix4().makeScale(4, 4, 4));
// 投影矩阵
const projectionMatrix = new Matrix4().identity();
const uniforms = { modelMatrix, projectionMatrix };
const width = 612;
const height = 512;
canvasEl.width = width;
canvasEl.height = height;
const ctx = canvasEl.getContext('2d');
const frameBufferData = ctx.getImageData(0, 0, width, height);
const { draw } = Render2FrameBuffer({ attributes, frameBufferData, vertShader, fragShader });
console.time('render');
draw(uniforms);
console.timeEnd('render');

ctx.putImageData(frameBufferData, 0, 0);
