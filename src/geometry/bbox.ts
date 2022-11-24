import { Vector4, Vector3 } from "three"

// 包围盒
class BBox {
  pMin = new Vector3(Infinity, Infinity, Infinity);
  pMax = new Vector3(-Infinity, -Infinity, -Infinity);
  constructor(points: Vector3[]) {
    for (let i = 0; i < points.length; i++) {
      this.pMin.x = Math.min(this.pMin.x, points[i].x);
      this.pMin.y = Math.min(this.pMin.y, points[i].y);
      this.pMin.z = Math.min(this.pMin.z, points[i].z);
      this.pMax.x = Math.max(this.pMax.x, points[i].x);
      this.pMax.y = Math.max(this.pMax.y, points[i].y);
      this.pMax.z = Math.max(this.pMax.z, points[i].z);
    }
  }

  // 是否有重叠
  overlaps(bbox: BBox) {
    const { pMin, pMax } = this;
    const x = pMax.x >= bbox.pMin.x && pMin.x <= bbox.pMax.x;
    const y = pMax.y >= bbox.pMin.y && pMin.y <= bbox.pMax.y;
    const z = pMax.z >= bbox.pMin.z && pMin.z <= bbox.pMax.z;
    return x && y && z;
  }

  inside(pt: Vector4) {
    const { pMin, pMax } = this;
    return pt.x >= pMin.x && pt.x <= pMax.x &&
     pt.y >= pMin.y && pt.y <= pMax.y && 
     pt.z >= pMin.z && pt.z <= pMax.z;
  }
}

export { BBox };
