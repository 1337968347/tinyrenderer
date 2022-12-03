import { Vector3 } from 'three';
import { Trangle, BBox } from '../geometry';

// 视锥体剔除  背面剔除
const croppingPipeline = (primitiveData: PrimitiveData, gl_positions: Trangle[]) => {
  const bbox = new BBox([new Vector3(-0.5, -0.5, -0.5), new Vector3(0.5, 0.5, 0.5)]);

  for (let i = 0; i < gl_positions.length; i++) {
    // 通过 视锥体剔除 和 背面剔除
    if (!frustumCull(gl_positions[i], bbox) || !backCull(gl_positions[i])) {
      gl_positions.splice(i, 1);
      for (let key in primitiveData) {
        primitiveData[key].splice(i, 1);
      }
    }
  }
};

// 视锥体剔除
const frustumCull = (gl_position: Trangle, bbox: BBox): boolean => {
  let outNum = 0;
  for (let i = 0; i < 3; i++) {
    if (!bbox.inside(gl_position.points[i])) {
      outNum++;
    }
  }
  if (outNum == 3) {
    // 完全在成像空间的外面，裁掉
    return false;
  }
  return true;
};

// 背面剔除
const backCull = (gl_position: Trangle) => {
  const [a, b, c] = gl_position.points;
  const ax = b.x - a.x;
  const ay = b.y - a.y;
  const bx = c.x - b.x;
  const by = c.y - b.y;
  const z = ax * by - ay * bx;
  return z > 0;
};

export { croppingPipeline };
