import { Matrix3, Matrix4, Vector3, Vector4 } from 'three';
import { ShaderProgram } from '../pipeline';

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

  enter(_graph: Graph) {}
  exit(_graph: Graph) {}
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
  }

  append(node: SceneNode) {
    this.root.append(node);
  }

  tick() {
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
  constructor(children: SceneNode[] = []) {
    super(children);
  }

  enter(graph: Graph): void {
    const frameBufferData = new ImageData(graph.viewPort.width, graph.viewPort.height);

    const shaderProgram = graph.getProgram();
    shaderProgram.bindFrameBuffer(frameBufferData);

    const program = graph.getProgram();
    program.draw(graph.uniform);
  }

  exit(graph: Graph): void {
    const shaderProgram = graph.getProgram();
    const frameBufferData = shaderProgram.frameBufferData;
    graph.ctx.putImageData(frameBufferData, 0, 0);
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
  far: number = 100;
  // 透视投影 视野范围
  fov: number = 50;
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
    const worldViewMat4 = this.getWorldView();
    const mvp = new Matrix4().multiplyMatrices(projectMat4, worldViewMat4);
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
  constructor(children: SceneNode[]) {
    super(children);
  }

  enter(graph: Graph): void {
    if (graph.uniform.modelView) {
      graph.uniform.modelView = graph.uniform.modelView.multiply(this.wordMatrix);
    } else {
      graph.uniform.modelView = new Matrix4().copy(this.wordMatrix);
    }
    graph.pushUniforms();
  }

  exit(graph: Graph) {
    graph.popUniforms();
  }
}
