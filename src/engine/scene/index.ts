import { Matrix4, Vector3 } from 'three';
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

  enter(_graph: Graph) {}
  exit(_graph: Graph) {}
}

class Graph {
  children: SceneNode[];
  uniform: uniformsProp = {};
  programs: ShaderProgram[] = [];
  root: SceneNode;
  constructor(children: SceneNode[]) {
    this.root = new SceneNode(children);
  }

  draw() {
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

class Material extends SceneNode {
  program: ShaderProgram;
  uniforms: Uniforms;
  constructor(program: ShaderProgram, uniforms: Uniforms, children: SceneNode[]) {
    super(children);
    this.program = program;
    this.uniforms = uniforms;
  }

  enter(graph: Graph): void {
    this.uniforms.enter(graph);
  }

  exit(graph: Graph) {
    this.uniforms.exit(graph);
  }
}

class Uniforms extends SceneNode {
  uniforms: uniformsProp;
  constructor(uniforms: uniformsProp, children: SceneNode[]) {
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

class Mesh extends SceneNode {
  children: SceneNode[];
  constructor(children: SceneNode[]) {
    super(children);
  }

  visit(graph: Graph): void {
    const program = graph.getProgram();
    program.draw(graph.uniform);
  }
}

class Camera extends SceneNode {
  // x Rotate
  x: number = 0.0;
  // y Rotate
  y: number = 0.0;
  // 透视投影 近截面
  near: number = 0.1;
  // 透视投影 远截面
  far: number = 1000;
  // 透视投影 视野范围
  fov: number = 50;
  // 相机视野左右跟上下的比例
  aspect: number = 1;
  position: Vector3;
  constructor(children: SceneNode[]) {
    super(children);
    this.position = new Vector3(0.0, 0.0, 0.0);
  }

  enter(graph: Graph) {
    graph.pushUniforms();
  }

  exit(graph: Graph) {
    graph.popUniforms();
  }

  perspective() {
    var top = this.near * Math.tan((this.fov * Math.PI) / 360.0);
    var right = top * this.aspect;
    return new Matrix4().makePerspective(-right, right, -top, top, this.near, this.far);
  }

  getWorldView() {
    const rotateXMat4 = new Matrix4().makeRotationX(this.x);
    const rotateYMat4 = new Matrix4().makeRotationY(this.y);
    const rotateMat4 = new Matrix4().multiplyMatrices(rotateXMat4, rotateYMat4);
    const translateMat4 = new Matrix4().makeTranslation(-this.position.x, -this.position.y, -this.position.z);
    return new Matrix4().multiplyMatrices(rotateMat4, translateMat4);
  }
}

export { Graph, Mesh, Material, Uniforms, Camera };
