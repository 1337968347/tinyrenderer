import { Vector4 } from 'three';
class Texture2D {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  constructor(imgEl: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    const gl = canvas.getContext('2d');
    gl.drawImage(imgEl, 0, 0);
    const imageData = gl.getImageData(0, 0, canvas.width, canvas.height);
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
  }

  getUV(u: number, v: number) {
    const { width, height, data } = this;
    const x = (width * u) | 0;
    const y = (height * v) | 0;
    const i = ((height - y) * width + x) << 2;
    return new Vector4(data[i], data[i + 1], data[i + 2], data[i + 3]);
  }
}

export { Texture2D };
