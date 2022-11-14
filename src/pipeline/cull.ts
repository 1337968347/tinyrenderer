import { vec3 } from 'gl-matrix';
import { Trangle, BBox } from '../geometry';

// 视锥体剔除  背面剔除
const croppingPipeline = (primitiveData: { [key: string]: Trangle[] }, gl_positions: Trangle[]) => {
  const bbox = new BBox([vec3.clone([-0.5, -0.5, -0.5]), vec3.clone([0.5, 0.5, 0.5])]);
  // 通过裁剪流水线的数据
  const cropped_PrimitiveData: { [key: string]: Trangle[] } = {};
  const cropped_Gl_Positions: Trangle[] = [];
  for (let i in primitiveData) {
    cropped_PrimitiveData[i] = [];
  }
  for (let i = 0; i < gl_positions.length; i++) {
    // 通过 视锥体剔除 和 背面剔除
    if (frustumCull(gl_positions[i], bbox) && backCull(gl_positions[i])) {
      cropped_Gl_Positions.push(gl_positions[i]);
      for (let key in primitiveData) {
        cropped_PrimitiveData[key].push(primitiveData[key][i]);
      }
    }
  }

  return { cropped_PrimitiveData, cropped_Gl_Positions };
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
  const [a, b] = gl_position.points;
  const z = a[0] * b[1] - a[1] * b[0];
  return z > 0;
};

export { croppingPipeline };
