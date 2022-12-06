import { Vector4 } from 'three';
import { clamp } from '../utils';
class Texture2D {
  imageData: ImageData;
  constructor(imageData: ImageData) {
    this.imageData = imageData;
  }

  uv(u: number, v: number) {
    u = clamp(0.0, u, 1.0);
    v = clamp(0.0, v, 1.0);
    const { width, height, data } = this.imageData;
    const x = (width * u) | 0;
    const y = (height * v) | 0;
    const i = (y * width + x) * 4;
    return new Vector4(data[i], data[i + 1], data[i + 2], data[i + 3]);
  }
}

export { Texture2D };
