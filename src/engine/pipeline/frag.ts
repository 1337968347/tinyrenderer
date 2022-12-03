import { Vector4 } from 'three';

const fragPipeline: FragPipeline = ({ fragmentData, data, fragShader, width, height }) => {
  const gl_FragColor = new Vector4(1.0, 1.0, 1.0, 1.0);
  for (let i = 0; i < fragmentData.length; i++) {
    const fragmentItem = fragmentData[i];
    if (fragmentItem.trangleIdx === -1) continue;
    const { x, y } = fragmentItem;
    fragShader(fragmentItem, gl_FragColor);
    const offset = ((height - y) * width + x) * 4;
    data[offset] = gl_FragColor.x;
    data[offset + 1] = gl_FragColor.y;
    data[offset + 2] = gl_FragColor.z;
    data[offset + 3] = gl_FragColor.w;
  }
};

export { fragPipeline };
