const vertPipeline: VertPipeline = ({ attributes, uniforms, vertShader }) => {
  const { position } = attributes;
  if (position.length < 3) throw new Error('顶点数太少');

  const vertLen = position.length;
  const verts: Vertex_t[] = [];

  // 逐顶点处理
  for (let i = 0; i < vertLen; i++) {
    const primaryData = {};
    const attribute = {};

    for (let key in attributes) {
      attribute[key] = attributes[key][i];
    }
    const { gl_position } = vertShader(attribute, uniforms, primaryData);
    const vert: Vertex_t = { pos: gl_position, rhw: 1.0 / gl_position.w, primaryData };
    verts.push(vert);
  }

  return verts;
};

export { vertPipeline };
