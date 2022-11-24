import { Matrix4 } from 'three';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { vertPipeline, vertShader, trangleMakePipeline, croppingPipeline, rasterizationPipeline, fragPipeline } from './pipeline';
import { bunnyStr } from './assets/bunny-obj';

const WIDTH = 512;
const HEIGHT = 512;
console.time('render');

const ctx = createCanvasRenderingContext2D({ width: WIDTH, height: HEIGHT });
ctx.fillRect(0, 0, WIDTH, HEIGHT);
// renderCoor(ctx, width, height);

const attributes = getPosAndNormal(bunnyStr);
// 模型变换矩阵
const modelMatrix = new Matrix4().makeTranslation(0, -0.3, 0.0);
modelMatrix.multiply(new Matrix4().makeScale(4, 4, 4));
// 投影矩阵
const projectionMatrix = new Matrix4().identity()
const uniforms = { modelMatrix, projectionMatrix };
// 顶点着色器
const { varyings, gl_positions } = vertPipeline(attributes, uniforms, vertShader);
// 图元组装
const { primitiveVaryingData, primitiveGlPosition } = trangleMakePipeline(varyings, gl_positions);
// 裁剪处理 (背面剔除, 视锥体剔除)
const { cropped_PrimitiveData, cropped_Gl_Positions } = croppingPipeline(primitiveVaryingData, primitiveGlPosition);
// 光栅化（图元数据 => 片元数据）
const fragmentData = rasterizationPipeline(cropped_PrimitiveData, cropped_Gl_Positions, WIDTH, HEIGHT);
const imageData = fragPipeline(fragmentData, ctx.getImageData(0, 0, WIDTH, HEIGHT), WIDTH, HEIGHT);

console.log(fragmentData);
ctx.putImageData(imageData, 0, 0);
console.timeEnd('render');
