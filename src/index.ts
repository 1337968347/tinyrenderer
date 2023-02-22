import { Matrix4, Vector4 } from 'three';
// import { GLTFLoader  } from "three/addons/loaders/GLTFLoader.js"
import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { bunnyStr } from './assets/bunny-obj';
import { getPosAndNormal } from './engine/utils';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';
import CameraController from './engine/control/cameraController';
import InputHandler from './engine/control/input';

let globalUniform: uniformsProp = {
  sunPosition: new Vector4(5, 5, 0, 1.0),
};

let frameBufferData = null;
let clock = null;
let cameraController: CameraController;
let camera: Scene.Camera = new Scene.Camera();
const canvasEl = document.querySelector('canvas');
canvasEl.width = 512;
canvasEl.height = 512;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler = new InputHandler(canvasEl);
let rabertTransform: Scene.Transform;
let robertRoteteY = 0;

const prepareScene = () => {
  // const data = parseObj(CottageString);
  // debugger;
  const attributes = getPosAndNormal(bunnyStr);
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
  rabertTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(5, -5, 5), new Matrix4().makeRotationY(robertRoteteY));
  cameraController.tick();
  graph.tick();
};
prepareScene();
clock = new Clock();
clock.setOnTick(tick);
clock.start();
// clock.stop();
