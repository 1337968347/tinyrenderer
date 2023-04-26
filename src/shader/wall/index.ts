import { Vector4, Vector3, Matrix4 } from 'three';
import { Texture2D } from '../../engine/geometry/texture';
import { calcPhongLight } from '../base/light';

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
  const { position, texcoord } = attribute;
  const { model, projection } = uniforms;
  // 世界坐标
  const vWorldPosition = new Vector4().copy(position);
  vWorldPosition.applyMatrix4(model as Matrix4);

  // 标准投影空间的坐标
  gl_position.copy(vWorldPosition).applyMatrix4(projection as Matrix4);
  // 传递给片元着色器的参数
  varyings['uv'] = texcoord;
  varyings['vWorldPosition'] = vWorldPosition;
};

const fragShader = (frag: Vertex_t, uniforms: uniformsProp, gl_FragColor: Vector4) => {
  const { varying } = frag;
  const { light, eye, wallLightMaterial } = uniforms;
  let { uv, vWorldPosition } = varying;
  const wallTexture: Texture2D = uniforms.texture as Texture2D;
  const wallNormalTexture: Texture2D = uniforms.normal as Texture2D;
  const texture = new Vector4(255.0, 255.0, 255.0, 255.0) || wallTexture.getUV(uv.x, uv.y);
  const normalVec4 = wallNormalTexture.getUV(uv.x, uv.y)
  const normal = new Vector3(normalVec4.x, normalVec4.y, normalVec4.z).normalize();

  const kl = calcPhongLight(wallLightMaterial, light, new Vector3(vWorldPosition.x, vWorldPosition.y, vWorldPosition.z), new Vector3(normal.x, normal.y, normal.z), eye);
  const color = texture.multiply(new Vector4().copy(light.color).multiplyScalar(kl));

  gl_FragColor.x = color.x | 0;
  gl_FragColor.y = color.y | 0;
  gl_FragColor.z = color.z | 0;
  gl_FragColor.w = 255;
};
export { vertShader, fragShader };
