import { vec3 } from 'gl-matrix';
import { Trangle } from '../geometry';

// 图元组装
const trangleMake = (attribute: { [key: string]: vec3[] }) => {
  const primitiveData = {};
  for (let key in attribute) {
    primitiveData[key] = [];
    for (let i = 0; i < attribute[key].length; i += 3) {
      primitiveData[key].push(new Trangle([attribute[key][i], attribute[key][i + 1], attribute[key][i + 2]]));
    }
  }

  return primitiveData;
};

export { trangleMake };
