// 顶点处理， 顶点变换
import { vertPipeline } from './vert';
// 图元组装
import { primitiveMakePipeline } from './primitive';
// 裁剪处理
import { croppingPipeline } from './cull';
// 透视除法
import { divisionPipeline } from './division';
// 光栅化
import { rasterizationPipeline } from './rasterization';
// 片元着色器
import { fragPipeline } from './frag';

class ShaderProgram {
  zBuffer: Float32Array;
  frameBufferData: ImageData;
  attributes: attributeProps;
  vertShader: VertShader;
  fragShader: FragShader;
  constructor({ attributes, vertShader, fragShader, frameBufferData }: ProgramProp) {
    const { width, height } = frameBufferData;
    this.frameBufferData = frameBufferData;
    this.attributes = attributes;
    this.zBuffer = new Float32Array(width * height);
    this.vertShader = vertShader;
    this.fragShader = fragShader;
  }

  bindFrameBuffer(frameBufferData: ImageData) {
    const { width, height } = frameBufferData;
    this.zBuffer = new Float32Array(width * height);
    this.frameBufferData = frameBufferData;
  }

  draw(uniforms: uniformsProp) {
    const { data, width, height } = this.frameBufferData;
    const { attributes, vertShader, zBuffer, fragShader } = this;
    data.fill(0);
    // 顶点着色器
    const { varyings, gl_positions } = vertPipeline({ attributes, uniforms, vertShader });
    // 透视除法
    // divisionPipeline(gl_positions);
    // 图元组装
    const { primitiveVaryingData, primitiveGlPosition } = primitiveMakePipeline(varyings, gl_positions);
    // 裁剪处理 (背面剔除, 视锥体剔除)
    croppingPipeline(primitiveVaryingData, primitiveGlPosition);
    // 光栅化（图元数据 => 片元数据）
    const fragmentData = rasterizationPipeline({ primitiveData: primitiveVaryingData, glPosition: primitiveGlPosition, width: width, height: height, zBuffer });
    // 片元光栅化
    fragPipeline({ fragmentData, zBuffer, data, fragShader });
  }
}
export { ShaderProgram };
