import { Matrix4, Vector4 } from 'three';
import * as Scene from './engine/scene';
import { ShaderProgram } from './engine/pipeline';
import { african_head } from './assets/african-head';
import { parseObj } from './engine/utils';
import * as BlackShader from './shader/black';
import * as WallShader from './shader/wall';
import { Clock } from './engine/utils';
import { screen_quad } from './engine/mesh';
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
let blackTransform: Scene.Transform;

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

  cameraController = new CameraController(inputHandler, camera);
  const blackProgram = new ShaderProgram(BlackShader);
  const wallProgram = new ShaderProgram(WallShader);
  blackTransform = new Scene.Transform([new Scene.Mesh({ position: positions, texcoord: texcoords, normal: normals })]);
  const blackMaterial = new Scene.Material(blackProgram, new Scene.Uniforms(globalUniform), [blackTransform]);
  const wallMaterial = new Scene.Material(wallProgram, new Scene.Uniforms(globalUniform), [new Scene.Mesh(screen_quad())]);
  camera.append(blackMaterial);
  // camera.append(wallMaterial);
  graph.append(camera);

  camera.position.set(0, 0, 25);
};
const tick = (_time: number) => {
  fpsEl.innerHTML = clock.fps + '';
  objectRoteteY += _time;
  blackTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(5, -5, 5), new Matrix4().makeRotationY(objectRoteteY));
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
