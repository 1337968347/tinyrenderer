import { Vector } from './index';

// 片元
class Frag {
  p: Vector;
  color: Vector;
  constructor(p: Vector, color: Vector) {
    this.p = p;
    this.color = color;
  }
}

export { Frag };
