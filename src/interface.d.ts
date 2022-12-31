import { Matrix4, Vector3, Vector4 } from 'three';
import { Trangle } from '../src/engine/geometry';
import { Texture2D } from './engine/geometry/texture';
declare global {
  type attributeProp = { [key: string]: Vector4 };
  // 图元
  type attributeProps = { [key: string]: Vector4[] };
  type uniformsProp = { [key: string]: Vector4 | number | Matrix4 | Texture2D | Vector3 };
  // 图元数据
  type PrimitiveData = { [key: string]: Trangle[] };
  // 片元数据
  type FragmentData = {
    x?: number;
    y?: number;
    u: number;
    v: number;
    trangleIdx: number;
    z?: number;
    primitiveData?: { [key: string]: Vector4 };
  };

  type VertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: attributeProps) => { gl_position: Vector4 };

  type FragShader = (fragmentData: FragmentData, gl_FragColor: Vector4) => void;

  type VertPipeline = (props: { attributes: attributeProps; uniforms: uniformsProp; vertShader: VertShader }) => {
    varyings: attributeProps;
    gl_positions: Vector4[];
  };
  type FragPipeline = (props: { fragmentData: FragmentData[]; zBuffer: Float32Array; data: Uint8ClampedArray; fragShader: FragShader }) => void;
  type ProgramProp = {
    attributes: attributeProps;
    vertShader: VertShader;
    fragShader: FragShader;
    frameBufferData: ImageData;
  };

  type TickFunc = (time: number) => void;
}
