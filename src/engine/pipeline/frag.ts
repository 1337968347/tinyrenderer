import { Vector4 } from 'three';

const gl_FragColor = new Vector4(0.0, 0.0, 0.0, 255.0);
const fragPipeline: FragPipeline = ({ fragmentData, zBuffer, data, fragShader }) => {
  for (let i = 0; i < zBuffer.length; i++) {
    const offset = i << 2;
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
    gl_FragColor.x = 0;
    gl_FragColor.y = 0;
    gl_FragColor.z = 0;
    gl_FragColor.w = 255;
  }
};

export { fragPipeline };
