// 顶点处理， 顶点变换
import { vertPipeline } from './vert';
// 图元组装
import { primitiveMakePipeline } from './primitive';
// 光栅化
import { rasterizationPipeline } from './rasterization';

class ShaderProgram {
  zBuffer: Float32Array;
  FRAGMENTDATAS: FragmentData[] = [];
  frameBufferData: ImageData;
  attributes: attributeProps;
  vertShader: VertShader;
  fragShader: FragShader;
  constructor({ attributes, vertShader, fragShader }: ProgramProp) {
    this.attributes = attributes;
    this.vertShader = vertShader;
    this.fragShader = fragShader;
  }

  bindFrameBuffer(frameBufferData: ImageData) {
    const { width, height } = frameBufferData;
    this.zBuffer = new Float32Array(width * height);
    if (this.FRAGMENTDATAS.length !== this.zBuffer.length) {
      // 帧缓存数据
      const FRAGMENTDATAS: FragmentData[] = new Array(this.zBuffer.length);
      for (let i = 0; i < this.zBuffer.length; i++) {
        FRAGMENTDATAS[i] = {
          u: 0,
          v: 0,
          trangleIdx: -1,
        };
      }
      this.FRAGMENTDATAS = FRAGMENTDATAS;
    }
    this.frameBufferData = frameBufferData;
  }

  draw(uniforms: uniformsProp) {
    const { attributes, vertShader, zBuffer, fragShader } = this;
    zBuffer.fill(-Infinity);
    // 顶点着色器
    const verts = vertPipeline({ attributes, uniforms, vertShader });
    // 图元组装
    const tragles = primitiveMakePipeline(verts);
    this.frameBufferData.data.fill(0);
    // 光栅化（图元数据 => 片元数据）
    rasterizationPipeline({ tragles, zBuffer, FRAGMENTDATAS: this.FRAGMENTDATAS, imageData: this.frameBufferData, fragShader });
  }
}

export { ShaderProgram };
