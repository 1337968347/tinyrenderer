import { Vector3 } from 'three';

/**
 * 计算冯氏光照的颜色
 * @param object 物体
 * @param light 光源
 * @param worldPos 物体点坐标
 * @param N 表面法向量
 * @param eyePos 相机位置
 * https://learnopengl-cn.github.io/02%20Lighting/05%20Light%20casters/
 * @returns 反射光源强度系数
 */
export const calcPhongLight = (lightMaterial: PhongLightMaterial, light: PhongLightPoint, worldPos: Vector3, N: Vector3, eyePos: Vector3) => {
  const { pos: lightPos } = light;
  const {
    ambientStrength,
    // 反射的漫反射光强度 Lambert
    diffuseStrength,
    // 反射的镜面反射光强度
    specularStrength,
    // 值越大，表面越平滑
    shininess,
  } = lightMaterial;

  // 入射光单位向量
  const L = new Vector3().subVectors(lightPos, worldPos).normalize();

  // 环境光 = 环境光强度
  const ambient = ambientStrength;

  const d = lightPos.distanceTo(worldPos);
  // 距离光纤衰减
  // 常数衰减系数
  const kc = 1;
  // 一次项衰减系数
  const kl = 0.1;
  // 二次项 衰减系数
  const kq = 0.01;
  // 距离衰减系数
  const fatt = 1.0 / (kc + kl * d + kq * d * d);
  // 法向量 点乘 入射光向量
  // 漫反射光 = 漫反射强度 * 光颜色 * (法向量 * 入射光向量) * 距离衰减系数
  const diffuse = fatt * Math.max(0.0, N.dot(L)) * diffuseStrength;
  // 视线向量
  const V = new Vector3().subVectors(eyePos, worldPos).normalize();
  // 半角向量
  const H = new Vector3().addVectors(L, V).normalize();
  // 镜面光 镜面反射光 = 镜面反射强度
  const specular = fatt * Math.pow(Math.max(0, N.dot(H)), shininess) * specularStrength;;

  // 镜面反射
  return ambient + diffuse + specular;
};
