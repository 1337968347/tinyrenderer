import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { getPosAndNormal } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';
import CameraController from './engine/control/cameraController';
import InputHandler from './engine/control/input';

let globalUniform: uniformsProp = {};

let frameBufferData = null;
let clock = null;
let cameraController: CameraController;
let camera: Scene.Camera;
const canvasEl = document.querySelector('canvas');
canvasEl.width = 256;
canvasEl.height = 256;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler;

const prepareScene = () => {
  const attributes = getPosAndNormal(bunnyStr);
  camera = new Scene.Camera();
  inputHandler = new InputHandler(canvasEl);
  cameraController = new CameraController(inputHandler, camera);
  const rabbitPragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
  const rabertMesh = new Scene.Mesh();
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [rabertMesh]);
  camera.append(baseMaterial);
  graph.append(camera);
};
const tick = (_time: number) => {
  cameraController.tick();
  graph.tick();
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
// clock.stop();
