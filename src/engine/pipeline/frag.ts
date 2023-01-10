import { Vector4 } from 'three';

const fragPipeline: FragPipeline = ({ fragmentData, zBuffer, data, fragShader }) => {
  const gl_FragColor = new Vector4(0.0, 0.0, 0.0, 255.0);
  for (let i = 0; i < zBuffer.length; i++) {
    const offset = i * 4;
    if (zBuffer[i] === -Infinity) {
 
      data[offset + 3] = 255;
      continue;
    }
    const fragmentItem = fragmentData[i];
    fragShader(fragmentItem, gl_FragColor);

    data[offset] = gl_FragColor.x;
    data[offset + 1] = gl_FragColor.y;
    data[offset + 2] = gl_FragColor.z;
    data[offset + 3] = gl_FragColor.w;
  }
};

export { fragPipeline };
