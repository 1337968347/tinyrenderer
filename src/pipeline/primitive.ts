import { vec3 } from 'gl-matrix';
import { Trangle } from '../geometry';

// 图元组装
const trangleMakePipeline = (attribute: { [key: string]: vec3[] }, gl_positions: vec3[]) => {
  const primitiveVaryingData: { [key: string]: Trangle[] } = {};
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

export { trangleMakePipeline };
