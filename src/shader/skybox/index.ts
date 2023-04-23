import { Matrix4, Matrix3, Vector3, Vector4 } from 'three';
import { Texture2D } from '../../engine/geometry/texture';

/**
 * 顶点变换 着色器
 * @param attribute
 * @param uniforms
 */
const vertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: Object, gl_position: Vector4) => {
    const { position, texcoord } = attribute;
    const { modelView, projection } = uniforms;
    // 世界坐标
    const vWorldPosition = new Vector4().copy(position);
    vWorldPosition.applyMatrix4(modelView as Matrix4);
    gl_position.copy(vWorldPosition).applyMatrix4(projection as Matrix4);
    // 传递给片元着色器的参数
    varyings['vWorldPosition'] = vWorldPosition;
    varyings['uv'] = texcoord;
};

const fragShader = (frag: Vertex_t, uniforms: uniformsProp, gl_FragColor: Vector4) => {
    // const { light, eye, blackLightMaterial } = uniforms;
    const { varying } = frag;
    // let { vNormal, vWorldPosition, uv } = varying;

    gl_FragColor.x = 0;
    gl_FragColor.y = 0;
    gl_FragColor.z = 0;
    gl_FragColor.w = 255;
};
export { vertShader, fragShader };
