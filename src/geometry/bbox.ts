import { vec3 } from 'gl-matrix';

// 包围盒
class BBox {
  pMin = vec3.clone([Infinity, Infinity, Infinity]);
  pMax = vec3.clone([-Infinity, -Infinity, -Infinity]);
  constructor(points: vec3[]) {
    for (let i = 0; i < points.length; i++) {
      this.pMin[0] = Math.min(this.pMin[0], points[i][0]);
      this.pMin[1] = Math.min(this.pMin[1], points[i][1]);
      this.pMin[2] = Math.min(this.pMin[2], points[i][2]);
      this.pMax[0] = Math.max(this.pMax[0], points[i][0]);
      this.pMax[1] = Math.max(this.pMax[1], points[i][1]);
      this.pMax[2] = Math.max(this.pMax[2], points[i][2]);
    }
  }

  absoluteOut(bbox: BBox) {
    
  }
}

export { BBox };
