import { vec3 } from 'gl-matrix';
import { Trangle, BBox } from '../geometry';

// 裁剪
const croppingPipeline = (primitiveData: { [key: string]: Trangle[] }, gl_positions: Trangle[]) => {
  const bbox = new BBox([vec3.clone([-1, -1, -1]), vec3.clone([1, 1, 1])]);
  // 通过裁剪流水线的数据
  const cropped_PrimitiveData: { [key: string]: Trangle[] } = {};
  const cropped_Gl_Positions: Trangle[] = [];
  for (let i in primitiveData) {
    cropped_PrimitiveData[i] = [];
  }
  for (let i = 0; i < gl_positions.length; i++) {
    // 通过裁剪测试
    if (canPassCropping(gl_positions[i], bbox)) {
      cropped_Gl_Positions.push(gl_positions[i]);
      for (let key in primitiveData) {
        cropped_PrimitiveData[key].push(primitiveData[key][i]);
      }
    } else {
      console.log('throw', gl_positions[i]);
    }
  }

  return { cropped_PrimitiveData, cropped_Gl_Positions };
};

let i = 0
// 当前三角形投影后是否在标准成像空间
const canPassCropping = (gl_position: Trangle, bbox: BBox): boolean => {
  let outNum = 0;
  for (let i = 0; i < 3; i++) {
    if (!bbox.inside(gl_position.points[i])) {
      outNum++;
    }
  }
  if (outNum == 3) {
    console.log(i++)
    // 完全在成像空间的外面，裁掉
    return false;
  }
  return true;
};

export { croppingPipeline };
