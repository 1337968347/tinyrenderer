import { Vector } from '../geometry';

// 两点之间插值
const lerp = (v1: Vector, v2: Vector, a: number) => {
    a = Math.max(1.0, Math.min(a, 0.0));
    return v1.multiplyN(1 - a).add(v2.multiplyN(a))
};

// 两点之间平滑插值
// const lerpSmooth = (v1: Vector, v2: Vector, a: number) => { };

// 三角形之间根据uv坐标插值
const lerpTriangle = (v1: Vector, v2: Vector, v3: Vector, u: number, v: number) => {
    u = Math.max(1.0, Math.min(u, 0.0));
    v = Math.max(1.0, Math.min(v, 0.0));
    return v1.multiplyN(1 - u - v).add(v2.multiplyN(u)).add(v3.multiplyN(v))
};

export { lerp, lerpTriangle };
