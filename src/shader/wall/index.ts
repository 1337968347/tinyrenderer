import { Vector4 } from 'three';
import { Texture2D } from '../../engine/geometry/texture';


/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, _uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
  const { position, texcoord } = attribute;
  // 标准投影空间的坐标
  gl_position.copy(position);
  // 传递给片元着色器的参数
  varyings['uv'] = texcoord;
};

const fragShader = (frag: Vertex_t, uniforms: uniformsProp, gl_FragColor: Vector4) => {
  const { varying } = frag;
  let { uv } = varying;
  const wallTexture: Texture2D = uniforms.texture as Texture2D;
  const texture = wallTexture.getUV(uv.x, uv.y);
  gl_FragColor.x = texture.x | 0;
  gl_FragColor.y = texture.y | 0;
  gl_FragColor.z = texture.z | 0;
  gl_FragColor.w = 255;
};
export { vertShader, fragShader };
