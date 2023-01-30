import { Vector4, Vector3 } from 'three';
import { Trangle, BBox } from '../geometry';

// 图元组装
// 拼成三角形->
const primitiveMakePipeline = (attribute: { [key: string]: Vector4[] }, gl_positions: Vector4[]) => {
  const { primitiveVaryingData, primitiveGlPosition } = makeTrangle(attribute, gl_positions);
  // 裁剪处理 (背面剔除, 视锥体剔除)
  croppingPipeline(primitiveVaryingData, primitiveGlPosition);
  return { primitiveVaryingData, primitiveGlPosition };
};

// 顶点拼成三角形
const makeTrangle = (attribute: { [key: string]: Vector4[] }, gl_positions: Vector4[]) => {
  const primitiveVaryingData: PrimitiveData = {};
  const primitiveGlPosition: Trangle[] = [];
  for (let key in attribute) {
    primitiveVaryingData[key] = [];
    for (let i = 0; i < attribute[key].length; i += 3) {
      primitiveVaryingData[key].push(new Trangle([attribute[key][i], attribute[key][i + 1], attribute[key][i + 2]]));
    }
  }

  for (let i = 0; i < gl_positions.length; i += 3) {
    primitiveGlPosition.push(new Trangle([gl_positions[i], gl_positions[i + 1], gl_positions[i + 2]]));
  }
  return { primitiveVaryingData, primitiveGlPosition };
};

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

export { primitiveMakePipeline };
