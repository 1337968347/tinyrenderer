// 顶点处理， 顶点变换
import { vertPipeline } from './vert';
// 图元组装
import { primitivePipeline } from './primitive';
// 光栅化
import { rasterizationPipeline } from './rasterization';

class ShaderProgram {
  zBuffer: Float32Array;
  frameBufferData: ImageData;
  attributes: attributeProps;
  vertShader: VertShader;
  fragShader: FragShader;
  constructor({ attributes, vertShader, fragShader, frameBufferData }: ProgramProp) {
    this.attributes = attributes;
    this.vertShader = vertShader;
    this.fragShader = fragShader;
    if (frameBufferData) {
      this.bindFrameBuffer(frameBufferData);
    }
  }

  bindFrameBuffer(frameBufferData: ImageData) {
    const { width, height } = frameBufferData;
    this.zBuffer = new Float32Array(width * height);

    this.frameBufferData = frameBufferData;
  }

  draw(uniforms: uniformsProp) {
    const { attributes, vertShader, zBuffer, fragShader } = this;
    // 顶点着色器
    let verts: Vertex_t[] = vertPipeline({ attributes, uniforms, vertShader });
    // 图元组装
    verts = primitivePipeline(verts, this.frameBufferData.width, this.frameBufferData.height);
    zBuffer.fill(-Infinity);
    this.frameBufferData.data.fill(0);
    // 光栅化（图元数据 => 片元数据）
    rasterizationPipeline({ verts, zBuffer, imageData: this.frameBufferData, fragShader, uniforms });
  }
}

export { ShaderProgram };
