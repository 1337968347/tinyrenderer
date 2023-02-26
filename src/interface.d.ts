import { Matrix4, Vector3, Vector4 } from 'three';
import { Trangle } from '../src/engine/geometry';
import { Texture2D } from './engine/geometry/texture';
declare global {
  type attributeProp = { [key: string]: Vector4 };
  // 图元
  type attributeProps = { position?: Vector4[]; [key: string]: Vector4[] };
  type uniformsProp = { modelView?: Matrix4; [key: string]: Vector4 | number | Matrix4 | Texture2D | Vector3 };
  // 图元数据
  type PrimitiveData = { [key: string]: Trangle[] };

  type VertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: attributeProps, gl_position: Vector4) => void;

  type FragShader = (vary: Vertex_t, uniforms: uniformsProp, gl_FragColor: GL_FragColor) => void;

  type VertPipeline = (props: { attributes: attributeProps; uniforms: uniformsProp; vertShader: VertShader }) => Vertex_t[];

  type rasterizationPipelineProps = {
    verts: Vertex_t[];
    zBuffer: Float32Array;
    imageData: ImageData;
    fragShader: FragShader;
    uniforms: uniformsProp;
  };

  type ProgramProp = {
    attributes: attributeProps;
    vertShader: VertShader;
    fragShader: FragShader;
  };

  type GL_FragColor = Vector4;

  type Texcoord_t = {
    u: number;
    v: number;
  };

  type Color_t = {
    r: number;
    g: number;
    b: number;
  };

  type Vertex_t = {
    pos: Vector4;
    rhw: number;
    primaryData: { [key: string]: Vector4 };
  };

  type Edge_t = {
    v?: Vertex_t;
    v1: Vertex_t;
    v2: Vertex_t;
  };

  type Trapezoid_t = {
    top: number;
    bottom: number;
    left: Edge_t;
    right: Edge_t;
  };

  type Scanline_t = {
    v?: Vertex_t;
    step: Vertex_t;
    x: number;
    y: number;
    w: number;
  };

  type TickFunc = (time: number) => void;
}
