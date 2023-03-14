import { Vector3 } from 'three';
import * as Scene from '../scene';
import InputHandler from './input';

export default class CameraController {
  input: InputHandler;
  camera: Scene.Camera;

  constructor(input: InputHandler, camera: Scene.Camera) {
    this.input = input;
    this.camera = camera;
  }

  tick() {
    const { x, y } = this.input.getOffsetFromElementCenter();
    this.camera.y += -x;
    this.camera.x += y;
    const inverseRotation = this.camera.getInverseRotation();
    const direction = new Vector3();
    if (this.input.keys.W) {
      direction.z = -1;
    } else if (this.input.keys.S) {
      direction.z = 1;
    }
    if (this.input.keys.A) {
      direction.x = -1;
    } else if (this.input.keys.D) {
      direction.x = 1;
    }
    direction.normalize();
    direction.applyMatrix4(inverseRotation);
    this.camera.position.add(direction);
  }
}
