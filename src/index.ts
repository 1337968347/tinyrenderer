import { Matrix4 } from 'three';
import { ShaderProgram } from './engine/pipeline';
import { getPosAndNormal } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';

let globalUniform: uniformsProp = {};
let pragram = null;
let ctx = null;
let frameBufferData = null;
let clock = null;
const prepareScene = () => {
  const canvasEl = document.querySelector('canvas');
  const attributes = getPosAndNormal(bunnyStr);
  // 模型变换矩阵
  const modelMatrix = new Matrix4().makeTranslation(0, -0.3, 0.0);
  modelMatrix.multiply(new Matrix4().makeScale(4, 4, 4));
  // 投影矩阵
  const projectionMatrix = new Matrix4().identity();
  globalUniform = { modelMatrix, projectionMatrix };
  const width = 512;
  const height = 512;
  canvasEl.width = width;
  canvasEl.height = height;
  ctx = canvasEl.getContext('2d');
  frameBufferData = new ImageData(width, height);
  pragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
};
const tick = time => {
  console.log(time);
  pragram.draw(globalUniform);
  ctx.putImageData(frameBufferData, 0, 0);
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
