import { Vector4 } from 'three';

const fragPipeline: FragPipeline = ({ fragmentData, zBuffer, data, fragShader }) => {
  const gl_FragColor = new Vector4(256.0, 256.0, 256.0, 256.0);
  for (let i = 0; i < zBuffer.length; i++) {
    if (zBuffer[i] === -Infinity) continue;
    const fragmentItem = fragmentData[i];
    fragShader(fragmentItem, gl_FragColor);
    const offset = i * 4;
    data[offset] = gl_FragColor.x;
    data[offset + 1] = gl_FragColor.y;
    data[offset + 2] = gl_FragColor.z;
    data[offset + 3] = gl_FragColor.w;
  }
};

export { fragPipeline };
