class SceneNode {
  children: SceneNode[] = [];
  constructor(children: SceneNode[] = []) {
    this.children = children;
  }

  visit() {
    this.enter();
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].visit();
    }
    this.exit();
  }

  enter() {}
  exit() {}
}

class Graph extends SceneNode {
  children: SceneNode[];
  uniform: uniformsProp = {};
  constructor(children: SceneNode[]) {
    super(children);
  }
  draw() {}
}

class RenderTarget extends SceneNode {}


class Mesh extends SceneNode {
  children: SceneNode[];
  constructor(children: SceneNode[]) {
    super(children);
  }
}

export { Graph, Mesh, RenderTarget };
