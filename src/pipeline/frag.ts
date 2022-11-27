import { Vector4 } from 'three';
import { FragmentData } from './rasterization';

const fragShader = (fragmentData: FragmentData): Vector4 => {
  const gl_FragColor = new Vector4(1.0, 1.0, 1.0, 1.0);
  const { primitiveData } = fragmentData;
  let { vNormal } = primitiveData;
  vNormal.normalize();
  const diffuse = Math.max(vNormal.dot(new Vector4(0, -1, 0, 1)), 0);
  gl_FragColor.x = diffuse;
  gl_FragColor.y = diffuse;
  gl_FragColor.z = diffuse;
  gl_FragColor.multiplyScalar(255);
  return gl_FragColor;
};

const fragPipeline = (fragmentData: FragmentData[], imageData: ImageData, width: number, height: number) => {
  for (let i = 0; i < fragmentData.length; i++) {
    const fragmentItem = fragmentData[i];
    if (fragmentItem.trangleIdx === -1) continue;
    const { x, y } = fragmentItem;
    const gl_FragColor = fragShader(fragmentItem);
    const offset = ((height - y) * width + x) * 4;
    imageData.data[offset] = gl_FragColor.x;
    imageData.data[offset + 1] = gl_FragColor.y;
    imageData.data[offset + 2] = gl_FragColor.z;
    imageData.data[offset + 3] = gl_FragColor.w;
  }
  return imageData;
};

export { fragPipeline, fragShader };
