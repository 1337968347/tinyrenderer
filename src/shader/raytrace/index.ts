import { Vector3, Vector4 } from "three";

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


const fragShader: FragShader = (
    _frag: Vertex_t,
    uniforms: uniformsProp,
    fragContext
) => {
    const { gl_FragColor, fragCoord, iResolution } = fragContext
    const { projection } = uniforms;


    const ro = new Vector3(0, 0, 0).applyMatrix4(projection)
    const rp = new Vector3(fragCoord.x / iResolution.x - 0.5, fragCoord.y / iResolution.y - 0.5, -1.0).applyMatrix4(projection)
    const rd = new Vector3().subVectors(rp, ro);

    const sphere = {
        
    }



    gl_FragColor.x = 220;
    gl_FragColor.y = 255;
    gl_FragColor.z = 255;
    gl_FragColor.w = 155;
};
export { vertShader, fragShader };
