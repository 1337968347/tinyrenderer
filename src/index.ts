import { Matrix4, Vector4 } from 'three';
import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { african_head } from './assets/african-head';
import { parseObj } from './engine/utils';
import { vertShader, fragShader } from './shader';
import { Clock } from './engine/utils';
import CameraController from './engine/control/cameraController';
import InputHandler from './engine/control/input';
import { Texture2D } from './engine/geometry/texture';
import Loader from './engine/utils/loader';

let globalUniform: uniformsProp = {
  sunPosition: new Vector4(5, 5, 0, 1.0),
};

let clock = new Clock();
let cameraController: CameraController;
let camera: Scene.Camera = new Scene.Camera();
const canvasEl = document.querySelector('canvas');
const fpsEl = document.querySelector('#fps');
const loader = new Loader('./assets/');
canvasEl.width = 512;
canvasEl.height = 512;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler = new InputHandler(canvasEl);
let objectTransform: Scene.Transform;
let objectRoteteY = 0;
loader.load(['texture.png']);

const prepareScene = () => {
  globalUniform['texture'] = new Texture2D(loader.resources['texture.png']);
  const { position, normal, texcoord } = parseObj(african_head);

  const positions: Vector4[] = [];
  const texcoords: Vector4[] = [];
  const normals: Vector4[] = [];
  for (let i = 0; i < position.length; i += 3) {
    positions.push(new Vector4(position[i], position[i + 1], position[i + 2], 1));
    texcoords.push(new Vector4(texcoord[i], texcoord[i + 1], 0, 1.0));
    normals.push(new Vector4(normal[i], normal[i + 1], normal[i + 2], 1));
  }
  const attributes = { position: positions, texcoord: texcoords, normal: normals };

  cameraController = new CameraController(inputHandler, camera);
  const rabbitPragram = new ShaderProgram({ vertShader, fragShader });
  objectTransform = new Scene.Transform([new Scene.Mesh(attributes)]);
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [objectTransform]);
  camera.append(baseMaterial);
  graph.append(camera);

  camera.position.set(0, 0, 25);
};
const tick = (_time: number) => {
  fpsEl.innerHTML = clock.fps + '';
  objectRoteteY += _time;
  objectTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(5, 5, 5), new Matrix4().makeRotationY(objectRoteteY));
  cameraController.tick();
  graph.tick();
};

loader.onRendy = () => {
  prepareScene();
  clock.setOnTick(tick);
  clock.start();
  // clock.stop();
  window['clock'] = clock;
};
