import { Vector } from '../geometry/vector';
import { mat4, vec3 } from 'gl-matrix';

// 图元
type attributeProps = { [key: string]: vec3[] };
type uniformsProps = { [key: string]: vec3 | number | mat4 };

/**
 * 提供顶点变换功能
 * @param attribute attributeProps
 * @param uniforms uniformsProps
 * @param varying
 * @param vertShaderHandle
 * @returns
 */
const vertShader = (attributes: attributeProps, uniforms: uniformsProps, vertShader) => {
  const { position } = attributes;
  const vertLen = position.length;
  const attribute = {};
  // 逐顶点计算的数据
  const varyings = [];
  // 用来做后面裁剪，光栅化深度测试用的顶点位置数据
  const gl_positions = [];

  // 逐顶点处理
  for (let i = 0; i < vertLen; i++) {
    // 复制当前顶点
    for (let key in attributes) {
      attribute[key] = vec3.clone(attributes[key][i]);
    }
    const { varying, gl_position } = vertShader(attribute, uniforms);
    varyings.push(varying);
    gl_positions.push(gl_position);
  }

  return { varyings, gl_positions };
};

export { vertShader };
