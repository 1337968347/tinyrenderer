import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { getPosAndNormal } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';
import CameraController from './engine/control/cameraController';
import InputHandler from './engine/control/input';
import { Matrix4 } from 'three';

let globalUniform: uniformsProp = {};

let frameBufferData = null;
let clock = null;
let cameraController: CameraController;
let camera: Scene.Camera;
const canvasEl = document.querySelector('canvas');
canvasEl.width = 512;
canvasEl.height = 512;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler;

const prepareScene = () => {
  const attributes = getPosAndNormal(bunnyStr);
  camera = new Scene.Camera();
  inputHandler = new InputHandler(canvasEl);
  cameraController = new CameraController(inputHandler, camera);
  const rabbitPragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
  const rabertTransform = new Scene.Transform([new Scene.Mesh()]);
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [rabertTransform]);
  camera.append(baseMaterial);
  graph.append(camera);

  camera.position.set(0, 0, 0);
  rabertTransform.wordMatrix = new Matrix4().makeScale(4, 4, 4);
};
const tick = (_time: number) => {
  // console.log(_time);
  cameraController.tick();
  graph.tick();
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
// clock.stop();
