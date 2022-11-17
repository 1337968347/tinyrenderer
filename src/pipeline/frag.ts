import { vec3, vec4 } from 'gl-matrix';
import { FragmentData } from './rasterization';

const fragShader = (fragmentData: FragmentData): vec4 => {
  const gl_FragColor = vec4.clone([0, 0, 0, 1]);
  const { primitiveData } = fragmentData;
  let { vNormal, vWorldPosition } = primitiveData;
  vec3.normalize(vNormal, vNormal);
  const diffuse = vec3.dot(vNormal, [0, -1, 0]);
  gl_FragColor[3] = diffuse 
  vec4.scale(gl_FragColor, gl_FragColor, 255);
  return gl_FragColor;
};

const fragPipeline = (fragmentData: FragmentData[], imageData: ImageData, width: number, height: number) => {
  for (let i = 0; i < fragmentData.length; i++) {
    const fragmentItem = fragmentData[i];
    if (!fragmentItem.isHit) continue;
    const { x, y } = fragmentItem;
    const gl_FragColor = fragShader(fragmentItem);
    const offset = ((height - y) * width + x) * 4;
    imageData.data[offset] = gl_FragColor[0];
    imageData.data[offset + 1] = gl_FragColor[1];
    imageData.data[offset + 2] = gl_FragColor[2];
    imageData.data[offset + 3] = gl_FragColor[3];
  }
  return imageData;
};

export { fragPipeline, fragShader };
