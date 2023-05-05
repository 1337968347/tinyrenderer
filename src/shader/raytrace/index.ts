import { Matrix4, Matrix3, Vector3, Vector4 } from "three";

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (
    attribute: attributeProp,
    uniforms: uniformsProp,
    varyings: Object,
    gl_position: Vector4
) => {
    const { position } = attribute;
    gl_position.copy(position);
};

const fragShader = (
    frag: Vertex_t,
    uniforms: uniformsProp,
    gl_FragColor: Vector4
) => {
    const { position, texcoord, normal } = uniforms;

    gl_FragColor.x = 255;
    gl_FragColor.y = 0;
    gl_FragColor.z = 0;
    gl_FragColor.w = 255;
};
export { vertShader, fragShader };
