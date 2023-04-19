import { Matrix4, Vector3, Vector4 } from 'three';
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

const light: PhongLightPoint = {
  pos: new Vector3(3.0, 0.0, 4.0),
  color: new Vector3(0.7, 0.7, 0.7),
};

let globalUniform: uniformsProp = {
  light,
};

let clock = new Clock();
let cameraController: CameraController;
let camera: Scene.Camera = new Scene.Camera();
const canvasEl = document.querySelector('canvas');
const fpsEl = document.querySelector('#fps');
const loader = new Loader('./assets/');
canvasEl.width = 1024;
canvasEl.height = 1024;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler = new InputHandler(canvasEl);
let wallTransform: Scene.Transform;
let blackTransform: Scene.Transform;
const wallLightMaterial: PhongLightMaterial = {
  // 反射的环境光强度
  ambientStrength: 0.2,
  // 反射的漫反射光强度 Lambert
  diffuseStrength: 0.5,
  // 反射的镜面反射光强度
  specularStrength: 5,
  // 值越大，表面越平滑
  shininess: 50,
};

const blackLightMaterial: PhongLightMaterial = {
  // 反射的环境光强度
  ambientStrength: 0.5,
  // 反射的漫反射光强度 Lambert
  diffuseStrength: 0.5,
  // 反射的镜面反射光强度
  specularStrength: 1,
  // 值越大，表面越平滑
  shininess: 50,
}

let objectRoteteY = 0;
loader.load(['texture.png', 'wall_normal_map.png']);

const prepareScene = () => {
  globalUniform['texture'] = new Texture2D(loader.resources['texture.png']);
  globalUniform['normal'] = new Texture2D(loader.resources['wall_normal_map.png']);
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
  wallTransform = new Scene.Transform([new Scene.Mesh(screen_quad(), [], 1)])
  wallTransform.wordMatrix = new Matrix4().makeScale(4, 4, 4)
  const blackMaterial = new Scene.Material(blackProgram, new Scene.Uniforms({ blackLightMaterial }), [blackTransform]);
  const wallMaterial = new Scene.Material(wallProgram, new Scene.Uniforms({ wallLightMaterial }), [wallTransform]);

  const gUniform = new Scene.Uniforms(globalUniform, [wallMaterial]);
  camera.append(gUniform);
  graph.append(camera);

  camera.position.set(0, 0, 10);
};

let cacheStr = ''

const tick = (_time: number) => {

  fpsEl.innerHTML = clock.fps + '';
  objectRoteteY += _time * 0.2;
  blackTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(4, -4, 4), new Matrix4().makeRotationY(objectRoteteY));
  cameraController.tick();
  const tempCacheStr = `${camera.position.x}-${camera.position.y}-${camera.position.z}-${camera.x}-${camera.y}`
  if (cacheStr === tempCacheStr) {
    return
  }
  cacheStr = tempCacheStr

  graph.tick();
};

loader.onRendy = () => {
  prepareScene();
  clock.setOnTick(tick);
  clock.start();
  // clock.stop();
  window['camera'] = camera
  window['clock'] = clock;
};
