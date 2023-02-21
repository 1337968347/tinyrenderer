import { Matrix4, Vector4 } from 'three';

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
  const { position, normal } = attribute;
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
};

const fragShader = (frag: Vertex_t, _uniforms: uniformsProp, gl_FragColor: Vector4) => {
  const { primaryData } = frag;
  let { vNormal } = primaryData;
  const normal = new Vector4().copy(vNormal).normalize()
  const diffuse = Math.max(normal.dot(new Vector4(0, 1, 0, 1)), 0);
  gl_FragColor.x = diffuse;
  gl_FragColor.y = diffuse;
  gl_FragColor.z = diffuse;
  gl_FragColor.multiplyScalar(255);
};
export { vertShader, fragShader };
