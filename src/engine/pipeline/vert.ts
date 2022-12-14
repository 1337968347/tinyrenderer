import { Vector4 } from 'three';

const vertPipeline: VertPipeline = ({ attributes, uniforms, vertShader }) => {
  const { position } = attributes;
  if (position.length < 3) throw new Error('顶点数太少');

  const vertLen = position.length;
  const attribute = {};
  // 逐顶点计算的数据
  const varyings: attributeProps = {
    vWorldPosition: [],
    vNormal: [],
  };
  // 用来做后面裁剪，光栅化深度测试用的顶点位置数据
  const gl_positions: Vector4[] = [];
  // 逐顶点处理
  for (let i = 0; i < vertLen; i++) {
    // 复制当前顶点
    for (let key in attributes) {
      attribute[key] = new Vector4().copy(attributes[key][i]);
    }
    const { gl_position } = vertShader(attribute, uniforms, varyings);
    gl_positions.push(gl_position);
  }

  return { varyings, gl_positions };
};

export { vertPipeline };
