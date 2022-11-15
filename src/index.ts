import { mat4, vec3 } from 'gl-matrix';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { vertPipeline, vertShader, trangleMakePipeline, croppingPipeline, rasterizationPipeline, fragPipeline } from './pipeline';
import { bunnyStr } from './assets/bunny-obj';

const WIDTH = 512;
const HEIGHT = 512;
console.time('render');

const ctx = createCanvasRenderingContext2D({ width: WIDTH, height: HEIGHT });
// renderCoor(ctx, width, height);

const attributes = getPosAndNormal(bunnyStr);
// 模型变换矩阵
const modelMatrix = mat4.identity(mat4.create());
mat4.translate(modelMatrix, modelMatrix, [0, 0.0, 0.0]);
mat4.scale(modelMatrix, modelMatrix, [2, 2, 2]);
// 投影矩阵
const projectionMatrix = mat4.identity(mat4.create());
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

ctx.putImageData(imageData, 0, 0);
console.timeEnd('render');
