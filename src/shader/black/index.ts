import { Matrix4, Vector4 } from 'three';
import { Texture2D } from '../../engine/geometry/texture';

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
  const { primaryData } = frag;
  let { vNormal, vWorldPosition } = primaryData;
  const texture = (uniforms.texture as Texture2D).getUV(primaryData.uv.x, primaryData.uv.y);
  const normal = new Vector4().copy(vNormal).normalize();
  const lightVec = new Vector4().subVectors(uniforms.sunPosition as Vector4, vWorldPosition).normalize();
  const diffuse = (Math.max(normal.dot(lightVec), 0) + 0.8) * 2;
  texture.multiplyScalar(diffuse);
  gl_FragColor.x = texture.x | 0;
  gl_FragColor.y = texture.y | 0;
  gl_FragColor.z = texture.z | 0;
  gl_FragColor.w = 255;
};
export { vertShader, fragShader };
