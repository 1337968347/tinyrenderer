import { mat4, vec3 } from 'gl-matrix';

// 图元
type attributeProps = { [key: string]: vec3[] };
type attributeProp = { [key: string]: vec3 };
type uniformsProps = { [key: string]: vec3 | number | mat4 };

/**
 * 顶点变换管线
 * @param attribute attributeProps
 * @param uniforms uniformsProps
 * @param varying
 * @param vertShaderHandle
 * @returns {varyings, gl_positions}
 */
const vertPipeline = (attributes: attributeProps, uniforms: uniformsProps, vertShader) => {
  const { position } = attributes;
  if (position.length < 3) throw new Error('顶点数太少');

  const vertLen = position.length;
  const attribute = {};
  // 逐顶点计算的数据
  const varyings = {
    vWorldPosition: [],
    vNormal: [],
  };
  // 用来做后面裁剪，光栅化深度测试用的顶点位置数据
  const gl_positions: vec3[] = [];

  // 逐顶点处理
  for (let i = 0; i < vertLen; i++) {
    // 复制当前顶点
    for (let key in attributes) {
      attribute[key] = vec3.clone(attributes[key][i]);
    }
    const { gl_position } = vertShader(attribute, uniforms, varyings);
    gl_positions.push(gl_position);
  }

  return { varyings, gl_positions };
};

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, uniforms: uniformsProps, varyings: Object) => {
  const { position, normal } = attribute;
  const { modelMatrix, projectionMatrix } = uniforms;
  // 世界坐标
  const vWorldPosition = vec3.create();
  // 法线
  const vNormal = vec3.create();
  // 标准投影空间的坐标
  const gl_position = vec3.create();

  vec3.transformMat4(vNormal, normal, modelMatrix as mat4);
  vec3.transformMat4(vWorldPosition, position, modelMatrix as mat4);
  vec3.transformMat4(gl_position, vWorldPosition, projectionMatrix as mat4);

  // 传递给片元着色器的参数
  varyings['vNormal'].push(vNormal);
  varyings['vWorldPosition'].push(vWorldPosition);

  return { gl_position };
};

export { vertPipeline, vertShader };
