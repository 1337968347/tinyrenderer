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

  // 是否有重叠
  overlaps(bbox: BBox) {
    const { pMin, pMax } = this;
    const x = pMax[0] >= bbox.pMin[0] && pMin[0] <= bbox.pMax[0];
    const y = pMax[1] >= bbox.pMin[1] && pMin[1] <= bbox.pMax[1];
    const z = pMax[2] >= bbox.pMin[2] && pMin[2] <= bbox.pMax[2];
    return x && y && z;
  }

  inside(pt: vec3) {
    const { pMin, pMax } = this;
    return pt[0] >= pMin[0] && pt[0] <= pMax[0] &&
     pt[1] >= pMin[1] && pt[1] <= pMax[1] && 
     pt[2] >= pMin[2] && pt[2] <= pMax[2];
  }
}

export { BBox };
