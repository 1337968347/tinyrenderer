import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { parseObj } from './engine/utils';
import { bunnyStr } from './assets/bunny-obj';
import { getPosAndNormal } from './engine/utils';
import { CottageString } from './assets/cottage-obj';
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
let rabertTransform: Scene.Transform;
let robertRoteteY = 0;

const prepareScene = () => {
  // const data = parseObj(CottageString);
  const attributes = getPosAndNormal(bunnyStr);
  camera = new Scene.Camera();
  inputHandler = new InputHandler(canvasEl);
  cameraController = new CameraController(inputHandler, camera);
  const rabbitPragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
  rabertTransform = new Scene.Transform([new Scene.Mesh()]);
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [rabertTransform]);
  camera.append(baseMaterial);
  graph.append(camera);

  camera.position.set(0, 0, 3);
};
const tick = (_time: number) => {
  console.log(_time);
  robertRoteteY += _time;
  rabertTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(1, -1, 1), new Matrix4().makeRotationY(robertRoteteY));
  cameraController.tick();
  graph.tick();
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
// clock.stop();
