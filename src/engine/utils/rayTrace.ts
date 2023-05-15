import { Vector3 } from "three";

class Thing {
    intersect(ray: Vector3) { }

    normal(pos: Vector3) { }
}


class Sphere extends Thing {
    center: Vector3;
    radius: number;

    constructor(center: Vector3, radius: number) {
        super();
        this.center = center;
        this.radius = radius;
    }

    intersect(ray: Vector3): number | null {
        // 计算射线与球体相交的距离
        const oc = new Vector3().subVectors(ray, this.center);
        const a = ray.dot(ray);
        const b = 2 * oc.dot(ray);
        const c = oc.dot(oc) - this.radius ** 2;
        const discriminant = b ** 2 - 4 * a * c;

        if (discriminant < 0) {
            // 没有实数根，射线与球体不相交
            return null;
        } else {
            // 返回相交处的距离
            const t =
                (-b - Math.sqrt(discriminant)) / (2 * a);
            return t > 0 ? t : (-b + Math.sqrt(discriminant)) / (2 * a);
        }
    }

    normal(pos: Vector3): Vector3 {
        // 计算球体在指定位置的法向量
        return new Vector3().subVectors(pos, this.center).normalize();
    }
}

class Plane extends Thing {
    n: Vector3;
    distance: number;

    constructor(normal: Vector3, distance: number) {
        super();
        this.n = normal.normalize(); // 法向量需要归一化
        this.distance = distance;
    }

    intersect(ray: Vector3): number | null {
        // 计算射线与平面相交的距离
        const denominator = this.n.dot(ray);

        if (denominator == 0) {
            // 射线与平面平行，不相交
            return null;
        } else {
            const t = -(ray.dot(this.n) + this.distance) / denominator;
            return t > 0 ? t : null;
        }
    }

    normal(_pos: Vector3): Vector3 {
        // 返回平面的法向量
        return this.n;
    }
}


class Triangle extends Thing {
    v1: Vector3;
    v2: Vector3;
    v3: Vector3;
    n: Vector3;

    constructor(v1: Vector3, v2: Vector3, v3: Vector3) {
        super();
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.n = new Vector3().subVectors(v2, v1).cross(new Vector3().subVectors(v3, v1)).normalize();
    }

    intersect(ray: Vector3): number | null {
        // 计算射线与三角形相交的距离
        const e1 = new Vector3().subVectors(this.v2, this.v1);
        const e2 = new Vector3().subVectors(this.v3, this.v1);
        const h = ray.cross(e2);
        const a = e1.dot(h);

        if (a > -1e-6 && a < 1e-6) {
            // 射线与三角形共面，不相交
            return null;
        }

        const f = 1 / a;
        const s = new Vector3().subVectors(ray, this.v1);
        const u = f * s.dot(h);

        if (u < 0 || u > 1) {
            // 射线与三角形不相交
            return null;
        }

        const q = s.cross(e1);
        const v = f * ray.dot(q);

        if (v < 0 || u + v > 1) {
            // 射线与三角形不相交
            return null;
        }

        const t = f * e2.dot(q);
        return t > 0 ? t : null;
    }

    normal(_pos: Vector3): Vector3 {
        // 返回三角形的法向量
        return this.n;
    }
}


export default { Sphere, Plane, Triangle }