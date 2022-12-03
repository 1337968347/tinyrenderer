import { Matrix4, Vector4 } from 'three';
import { Trangle } from '../src/engine/geometry';
declare global {
  type attributeProp = { [key: string]: Vector4 };
  // 图元
  type attributeProps = { [key: string]: Vector4[] };
  type uniformsProp = { [key: string]: Vector4 | number | Matrix4 };
  // 图元数据
  type PrimitiveData = { [key: string]: Trangle[] };
  // 片元数据
  type FragmentData = {
    x: number;
    y: number;
    u: number;
    v: number;
    trangleIdx: number;
    z?: number;
    primitiveData?: { [key: string]: Vector4 };
  };
}
