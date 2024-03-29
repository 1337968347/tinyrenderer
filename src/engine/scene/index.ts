import { Matrix3, Matrix4, Vector3, Vector4 } from 'three';
import { State, ShaderProgram } from "../index"

class SceneNode {
  children: SceneNode[] = [];
  constructor(children: SceneNode[] = []) {
    this.children = children;
  }

  visit(graph: Graph) {
    this.enter(graph);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].visit(graph);
    }
    this.exit(graph);
  }

  append(node: SceneNode) {
    this.children.push(node);
  }

  enter(_graph: Graph) { }
  exit(_graph: Graph) { }
}

type GraphProp = {
  canvasEl?: HTMLCanvasElement;
  width?: number;
  height?: number;
};

// 开放场景图
export class Graph {
  children: SceneNode[];
  uniform: uniformsProp = {};
  programs: ShaderProgram[] = [];
  root: SceneNode = new SceneNode([]);
  canvasEl: HTMLCanvasElement = null;
  ctx: CanvasRenderingContext2D;

  originFrameBufferData: FrameBufferData;
  // 帧缓冲对象
  frameBufferData: FrameBufferData;
  viewPort: { width: number; height: number } = { width: 0, height: 0 };

  constructor(props: GraphProp = { width: 512, height: 512 }) {
    const { canvasEl, width, height } = props;
    if (canvasEl) {
      this.canvasEl = canvasEl;
      this.ctx = this.canvasEl.getContext('2d');
      this.viewPort.width = canvasEl.width || 512;
      this.viewPort.height = canvasEl.height || 512;
    } else {
      this.canvasEl = document.createElement('canvas');
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      this.ctx = this.canvasEl.getContext('2d');
      this.viewPort.width = width || 512;
      this.viewPort.height = height || 512;
    }
    // 创建帧缓冲对象
    const frameBufferData: FrameBufferData = {
      color: this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height),
      zBuffer: new Float32Array(this.viewPort.width * this.viewPort.height)
    }
    this.originFrameBufferData = frameBufferData;
    this.bindFrameBuffer(frameBufferData);
  }

  append(node: SceneNode) {
    this.root.append(node);
  }

  tick() {
    this.draw();
  }

  draw() {
    this.clear();
    this.root.visit(this);
  }

  pushUniforms() {
    this.uniform = Object.create(this.uniform);
  }

  popUniforms() {
    this.uniform = Object.getPrototypeOf(this.uniform);
  }

  pushProgram(program: ShaderProgram) {
    this.programs.push(program);
  }

  popProgram() {
    this.programs.pop();
  }

  getProgram() {
    return this.programs[this.programs.length - 1];
  }

  bindFrameBuffer(frameBufferData: FrameBufferData) {
    if (this.viewPort.width !== frameBufferData.color.width || this.viewPort.height !== frameBufferData.color.height) {
      throw new Error("颜色缓冲区的宽高跟当前场景图的宽高不一致");
    }
    if (this.viewPort.width * this.viewPort.height !== frameBufferData.zBuffer.length) {
      throw new Error("深度缓冲区的宽高跟当前场景图的宽高不一致");
    }
    this.frameBufferData = frameBufferData;
  }

  unbindFrameBuffer() {
    this.frameBufferData = this.originFrameBufferData;
  }

  clear() {
    this.frameBufferData.zBuffer.fill(0);
    this.frameBufferData.color.data.fill(0);
    this.frameBufferData.stencil?.fill(0)
  }
}

export class Material extends SceneNode {
  program: ShaderProgram;
  uniforms: Uniforms;
  constructor(program: ShaderProgram, uniforms: Uniforms, children: SceneNode[] = []) {
    super(children);
    this.program = program;
    this.uniforms = uniforms;
  }

  enter(graph: Graph): void {
    graph.pushProgram(this.program);
    this.uniforms.enter(graph);
  }

  exit(graph: Graph) {
    graph.popProgram();
    this.uniforms.exit(graph);
  }
}

export class Uniforms extends SceneNode {
  uniforms: uniformsProp;
  constructor(uniforms: uniformsProp, children: SceneNode[] = []) {
    super(children);
    this.uniforms = uniforms;
  }

  enter(scene: Graph) {
    scene.pushUniforms();
    for (let uniform in this.uniforms) {
      scene.uniform[uniform] = this.uniforms[uniform];
    }
  }

  exit(scene: Graph) {
    scene.popUniforms();
  }
}

export class Mesh extends SceneNode {
  children: SceneNode[];
  attributes: AttributeProps;
  constructor(attributes: AttributeProps, children: SceneNode[] = []) {
    super(children);
    this.attributes = attributes;
  }

  enter(graph: Graph): void {
    const program = graph.getProgram();
    program.draw(this.attributes, graph.uniform, graph);
    // const zBufferColor = new ImageData(graph.viewPort.width, graph.viewPort.height)
    // for (let i = 0; i < graph.viewPort.height; i++) {
    //   for (let j = 0; j < graph.viewPort.width; j++) {
    //     const idx = (i * graph.viewPort.width) + j
    //     zBufferColor.data[(idx << 2) + 3] = graph.frameBufferData.zBuffer[idx] * 255
    //   }
    // }
    graph.ctx.putImageData(graph.frameBufferData.color, 0, 0);
  }
}

export class Camera extends SceneNode {
  // x Rotate
  x: number = 0.0;
  // y Rotate
  y: number = 0.0;
  // 透视投影 近截面
  near: number = 0.01;
  // 透视投影 远截面
  far: number = 1000;
  // 透视投影 视野范围
  fov: number = 80;
  // 相机视野左右跟上下的比例
  aspect: number = 1;
  position: Vector3;
  constructor(children: SceneNode[] = []) {
    super(children || []);
    this.position = new Vector3(0.0, 0.0, 0.0);
  }

  enter(graph: Graph) {
    graph.pushUniforms();

    const projectMat4 = this.perspective();
    const lookAtMat4 = this.getWorldView();
    const mvp = new Matrix4().multiplyMatrices(projectMat4, lookAtMat4);
    // 方向矩阵
    graph.uniform.view = lookAtMat4;
    graph.uniform.projection = mvp;
    graph.uniform.eye = this.position;
  }

  exit(graph: Graph) {
    graph.popUniforms();
  }

  project(point: Vector4) {
    const mvp = new Matrix4().multiplyMatrices(this.perspective(), this.getWorldView());
    const p = point.applyMatrix4(mvp);
    // 透视除法
    p.multiplyScalar(1 / p.w);
    return p;
  }

  perspective() {
    var top = this.near * Math.tan((this.fov * Math.PI) / 360.0);
    var right = top * this.aspect;
    return new Matrix4().makePerspective(-right, right, -top, top, this.near, this.far);
  }

  getInverseRotation() {
    return new Matrix4().setFromMatrix3(new Matrix3().setFromMatrix4(this.getWorldView().invert()));
  }

  getWorldView() {
    const rotateXMat4 = new Matrix4().makeRotationX(this.x);
    const rotateYMat4 = new Matrix4().makeRotationY(this.y);
    const rotateMat4 = new Matrix4().multiplyMatrices(rotateXMat4, rotateYMat4);
    const translateMat4 = new Matrix4().makeTranslation(-this.position.x, -this.position.y, -this.position.z);
    return new Matrix4().multiplyMatrices(rotateMat4, translateMat4);
  }
}

export class Transform extends SceneNode {
  wordMatrix = new Matrix4().identity();

  enter(graph: Graph): void {
    if (graph.uniform.model) {
      graph.uniform.model = graph.uniform.model.multiply(this.wordMatrix);
    } else {
      graph.uniform.model = new Matrix4().copy(this.wordMatrix);
    }
    graph.pushUniforms();
  }

  exit(graph: Graph) {
    graph.popUniforms();
  }
}


export class SkyBox extends SceneNode {
  lastCvvState: boolean;
  lastBackState: boolean;
  uniforms: Uniforms;

  constructor(children: SceneNode[] = [], uniforms: Uniforms) {
    super(children);
    this.uniforms = uniforms;
  }


  enter(graph: Graph): void {
    this.lastCvvState = State.state['use-cvvCull'];
    this.lastBackState = State.state['use-backCull'];
    State.disable('use-cvvCull')
    State.enable('use-backCull')
    this.uniforms.enter(graph);
  }

  exit(graph: Graph): void {
    State.state['use-cvvCull'] = this.lastCvvState;
    State.state['use-backCull'] = this.lastBackState;
    this.uniforms.exit(graph)
  }
}

// FrameBufferObject
export class RenderTarget extends SceneNode {
  fbo: FrameBufferData
  constructor(children: SceneNode[]) {
    super(children)
  }

  enter(graph: Graph): void {
    const { width, height } = graph.viewPort
    if (!this.fbo || width * height !== this.fbo.zBuffer.length) {
      // 创建帧缓冲对象
      const fbo: FrameBufferData = {
        color: new ImageData(width, height),
        zBuffer: new Float32Array(width * height)
      }
      this.fbo = fbo;
    }
    graph.bindFrameBuffer(this.fbo)
  }

  exit(graph: Graph): void {
    graph.unbindFrameBuffer();
  }
}

export class RayTrace extends SceneNode {
  constructor(children: SceneNode[] = []) {
    super(children)
  }

  enter(_graph: Graph): void {

  }

  exit(_graph: Graph): void {

  }
}