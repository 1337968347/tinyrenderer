import { Matrix4, Matrix3, Vector3, Vector4 } from "three";
import { Texture2D } from "../../engine/geometry/texture";

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
    const { position, texcoord } = attribute;
    const { model, view, projection } = uniforms;
    // 世界坐标
    const vWorldPosition = new Vector4().copy(position);
    vWorldPosition.applyMatrix4(model as Matrix4);
    gl_position.copy(vWorldPosition).applyMatrix4(projection);
    // 传递给片元着色器的参数
    varyings["vWorldPosition"] = vWorldPosition;
    varyings["uv"] = texcoord;
};

const fragShader = (
    frag: Vertex_t,
    uniforms: uniformsProp,
    gl_FragColor: Vector4
) => {
    const { posX, posY, posZ, negX, negY, negZ } = uniforms;
    const { varying } = frag;
    const vWorldPosition = new Vector3(
        varying.vWorldPosition.x,
        varying.vWorldPosition.y,
        varying.vWorldPosition.z
    );
    vWorldPosition.normalize();
    const { x, y, z } = vWorldPosition;
    let aX = Math.abs(x);
    let aY = Math.abs(y);
    let aZ = Math.abs(z);
    let u = 0;
    let v = 0;
    let weight = 1;
    let texture: Texture2D = posX;
    if (aX > aY && aX > aZ) {
        if (x > 0) {
            // 正X面
            u = z;
            v = -y;
            texture = posX;
        } else {
            // 负X面
            u = -z;
            v = -y;
            texture = negX;
        }
        weight = aX;
    } else if (aY > aX && aY > aZ) {
        if (y > 0) {
            // 正Y面
            u = x;
            v = z;
            texture = negY;
        } else {
            // 负Y面
            u = x;
            v = z;
            texture = posY;
        }
        weight = aY;
    } else {
        if (z > 0) {
            // 正Z面
            u = x;
            v = -y;
            texture = negZ;
        } else {
            // 负Z面
            u = -x;
            v = -y;
            texture = posZ;
        }

        weight = aZ;
    }
    u = (u / weight + 1) / 2;
    v = (v / weight + 1) / 2;

    const color = texture.getUV(u, v);

    gl_FragColor.x = color.x;
    gl_FragColor.y = color.y;
    gl_FragColor.z = color.z;
    gl_FragColor.w = 255;
};
export { vertShader, fragShader };
