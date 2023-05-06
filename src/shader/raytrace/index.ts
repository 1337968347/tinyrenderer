import { Vector4 } from "three";

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (
    attribute: attributeProp,
    _uniforms: uniformsProp,
    _varyings: Object,
    gl_position: Vector4
) => {
    const { position } = attribute;
    gl_position.copy(position);
};

const fragShader = (
    _frag: Vertex_t,
    _uniforms: uniformsProp,
    gl_FragColor: Vector4
) => {
    // const { position, texcoord, normal } = uniforms;

    gl_FragColor.x = 220;
    gl_FragColor.y = 255;
    gl_FragColor.z = 255;
    gl_FragColor.w = 155;
};
export { vertShader, fragShader };
