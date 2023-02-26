// 顶点处理， 顶点变换
import { vertPipeline } from './vert';
// 图元组装
import { primitivePipeline } from './primitive';
// 光栅化
import { rasterizationPipeline } from './rasterization';
import * as Scene from '../scene';

class ShaderProgram {
  attributes: attributeProps;
  vertShader: VertShader;
  fragShader: FragShader;
  constructor({ attributes, vertShader, fragShader }: ProgramProp) {
    this.attributes = attributes;
    this.vertShader = vertShader;
    this.fragShader = fragShader;
  }

  draw(uniforms: uniformsProp, graph: Scene.Graph) {
    const { zBuffer, frameBufferData } = graph;
    const { attributes, vertShader, fragShader } = this;
    // 顶点着色器
    let verts: Vertex_t[] = vertPipeline({ attributes, uniforms, vertShader });
    // 图元组装
    verts = primitivePipeline(verts, graph.viewPort.width, graph.viewPort.height);
    // 光栅化（图元数据 => 片元数据）
    rasterizationPipeline({ verts, zBuffer, imageData: frameBufferData, fragShader, uniforms });
  }
}

export { ShaderProgram };
