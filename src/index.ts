import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { getPosAndNormal } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';
import CameraController from './engine/control/cameraController';
import InputHandler from './engine/control/input';

let globalUniform: uniformsProp = {};

let ctx = null;
let frameBufferData = null;
let clock = null;
let cameraController: CameraController;
let camera: Scene.Camera;
let graph = new Scene.Graph();
let inputHandler: InputHandler;

const prepareScene = () => {
  const canvasEl = document.querySelector('canvas');
  const attributes = getPosAndNormal(bunnyStr);
  camera = new Scene.Camera();
  inputHandler = new InputHandler(canvasEl);
  cameraController = new CameraController(inputHandler, camera);
  const width = 256;
  const height = 256;
  canvasEl.width = width;
  canvasEl.height = height;
  ctx = canvasEl.getContext('2d');
  frameBufferData = new ImageData(width, height);
  const rabbitPragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
  const rabertMesh = new Scene.Mesh();
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [rabertMesh]);
  camera.append(baseMaterial);
  graph.append(camera);
};
const tick = (time: number) => {
  console.log(time);
  cameraController.tick();
  graph.tick();
  ctx.putImageData(frameBufferData, 0, 0);
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
// clock.stop();
