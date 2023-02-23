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

let globalUniform: uniformsProp = {
  sunPosition: new Vector4(5, 5, 0, 1.0),
};

let frameBufferData = null;
let clock = new Clock();
let cameraController: CameraController;
let camera: Scene.Camera = new Scene.Camera();
const canvasEl = document.querySelector('canvas');
canvasEl.width = 512;
canvasEl.height = 512;
let graph = new Scene.Graph({ canvasEl });
let inputHandler: InputHandler = new InputHandler(canvasEl);
let rabertTransform: Scene.Transform;
let robertRoteteY = 0;

const loaderAssets = () => {
  return new Promise(resolve => {
    const img = new Image();
    img.src = './assets/texture.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const gl = canvas.getContext('2d');
      gl.drawImage(img, 0, 0);
      resolve(gl.getImageData(0, 0, canvas.width, canvas.height));
    };
  });
};

const prepareScene = resource => {
  globalUniform['texture'] = new Texture2D(resource.textureData);
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
  const rabbitPragram = new ShaderProgram({ attributes, frameBufferData, vertShader, fragShader });
  rabertTransform = new Scene.Transform([new Scene.Mesh()]);
  const baseMaterial = new Scene.Material(rabbitPragram, new Scene.Uniforms(globalUniform), [rabertTransform]);
  camera.append(baseMaterial);
  graph.append(camera);

  camera.position.set(0, 0, 18);
};
const tick = (_time: number) => {
  console.log(_time);
  robertRoteteY += _time;
  rabertTransform.wordMatrix = new Matrix4().multiplyMatrices(new Matrix4().makeScale(5, -5, 5), new Matrix4().makeRotationY(robertRoteteY));
  cameraController.tick();
  graph.tick();
};

loaderAssets().then(imageData => {
  const resource = {
    textureData: imageData,
  };
  prepareScene(resource);
  clock.setOnTick(tick);
  clock.start();
  // clock.stop();
});
