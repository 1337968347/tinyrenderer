import { Vector4 } from 'three';

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, _uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
  const { position } = attribute;
  // 标准投影空间的坐标
  gl_position.copy(position);
  // 传递给片元着色器的参数
  varyings['uv'] = new Vector4(position.x / 2 + 0.5, position.y / 2 + 0.5, 0.0, 1.0);
};

const fragShader = (_frag: Vertex_t, _uniforms: uniformsProp, gl_FragColor: Vector4) => {
  gl_FragColor.x = 0 | 0;
  gl_FragColor.y = 0 | 0;
  gl_FragColor.z = 0 | 0;
  gl_FragColor.w = 255;
};
export { vertShader, fragShader };
