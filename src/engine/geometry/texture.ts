import { Vector4 } from 'three';
import { clamp } from '../utils';
class Texture2D {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  constructor(imageData: ImageData) {
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
  }

  getUV(u: number, v: number) {
    u = clamp(0.0, u, 1.0);
    v = clamp(0.0, v, 1.0);
    const { width, height, data } = this;
    const x = (width * u) | 0;
    const y = (height * v) | 0;
    const i = ((height - y) * width + x) << 2;
    return new Vector4(data[i], data[i + 1], data[i + 2], data[i + 3]);
  }
}

export { Texture2D };
