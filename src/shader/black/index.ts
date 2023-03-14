import { Matrix4, Vector3, Vector4 } from 'three';
import { Texture2D } from '../../engine/geometry/texture';
import { calcPhongLight } from '../base/light';

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
  const { position, normal, texcoord } = attribute;
  const { modelView, projection } = uniforms;
  // 世界坐标
  const vWorldPosition = new Vector4().copy(position);
  // 法线
  const vNormal = new Vector4().copy(normal);
  // 标准投影空间的坐标
  gl_position.copy(position);
  vNormal.applyMatrix4(modelView as Matrix4);
  vWorldPosition.applyMatrix4(modelView as Matrix4);
  gl_position.applyMatrix4(modelView).applyMatrix4(projection as Matrix4);
  // 传递给片元着色器的参数
  varyings['vNormal'] = vNormal;
  varyings['vWorldPosition'] = vWorldPosition;
  varyings['uv'] = texcoord;
};

const fragShader = (frag: Vertex_t, uniforms: uniformsProp, gl_FragColor: Vector4) => {
  const { light, eye, blackLightMaterial } = uniforms;
  const { varying } = frag;
  let { vNormal, vWorldPosition, uv } = varying;
  const blackTexture: Texture2D = uniforms.texture as Texture2D;
  const texture = blackTexture.getUV(uv.x, uv.y);
  const normal = new Vector3(vNormal.x, vNormal.y, vNormal.z).normalize();
  const kl = calcPhongLight(blackLightMaterial, light, new Vector3(vWorldPosition.x, vWorldPosition.y, vWorldPosition.z), normal, eye);
  const color = texture.multiply(new Vector4().copy(light.color).multiplyScalar(kl));

  gl_FragColor.x = color.x | 0;
  gl_FragColor.y = color.y | 0;
  gl_FragColor.z = color.z | 0;
  gl_FragColor.w = 255;
};
export { vertShader, fragShader };
