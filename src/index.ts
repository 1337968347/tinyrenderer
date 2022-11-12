import { mat4, vec3 } from 'gl-matrix';
import { createCanvasRenderingContext2D, getPosAndNormal } from './utils';
import { vertPipeline, vertShader, trangleMakePipeline, croppingPipeline, rasterizationPipeline } from './pipeline';
import { bunnyStr } from './assets/bunny-obj';

const width = 500;
const height = 500;

const ctx = createCanvasRenderingContext2D({ width, height });
// renderCoor(ctx, width, height);

const attributes = getPosAndNormal(bunnyStr);
// 模型变换矩阵
const modelMatrix = mat4.identity(mat4.create());
mat4.scale(modelMatrix, modelMatrix, vec3.clone([2, 2, 2]));
// 投影矩阵
const projectionMatrix = mat4.identity(mat4.create());
const uniforms = { modelMatrix, projectionMatrix };
// 顶点着色器
const { varyings, gl_positions } = vertPipeline(attributes, uniforms, vertShader);
// 图元组装
const { primitiveVaryingData, primitiveGlPosition } = trangleMakePipeline(varyings, gl_positions);
// 裁剪处理 (背面剔除, 视锥体剔除)
const { cropped_PrimitiveData, cropped_Gl_Positions } = croppingPipeline(primitiveVaryingData, primitiveGlPosition);
// 光栅化
rasterizationPipeline(cropped_PrimitiveData, cropped_Gl_Positions);
console.log(cropped_PrimitiveData, cropped_Gl_Positions);
const imageData = ctx.getImageData(0, 0, width, height);

ctx.putImageData(imageData, 0, 0);
