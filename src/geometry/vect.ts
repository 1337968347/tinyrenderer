class Vector {
  x: number;
  y: number;
  z: number;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static MultiplyN(a: Vector, n: number) {
    return a.multiplyN(n);
  }

  static Add(a: Vector, b: Vector) {
    return a.add(b);
  }

  static Multiply(v1: Vector, v2: Vector) {
    return v1.multiply(v2);
  }

  multiply(v1: Vector) {
    return new Vector(v1.x * this.x, v1.y * this.y, v1.z * this.z);
  }

  // 向量乘法
  multiplyN(n: number) {
    return new Vector(this.x * n, this.y * n, this.z * n);
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }
}

export { Vector };
