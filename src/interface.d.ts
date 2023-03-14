import { Matrix4, Vector3, Vector4 } from 'three';
import { Trangle } from '../src/engine/geometry';
import { Texture2D } from './engine/geometry/texture';
declare global {
  type attributeProp = { [key: string]: Vector4 };
  // 图元
  type AttributeProps = { position?: Vector4[]; [key: string]: Vector4[] };
  type uniformsProp = { modelView?: Matrix4; [key: string]: Vector4 | number | Matrix4 | Texture2D | Vector3 | any };
  // 图元数据
  type PrimitiveData = { [key: string]: Trangle[] };

  type VertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: AttributeProps, gl_position: Vector4) => void;

  type FragShader = (vary: Vertex_t, uniforms: uniformsProp, gl_FragColor: GL_FragColor) => void;

  type VertPipeline = (props: { attributes: AttributeProps; uniforms: uniformsProp; vertShader: VertShader }) => Vertex_t[];

  type rasterizationPipelineProps = {
    verts: Vertex_t[];
    zBuffer: Float32Array;
    imageData: ImageData;
    fragShader: FragShader;
    uniforms: uniformsProp;
  };

  type ProgramProp = {
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
    varying: { [key: string]: Vector4 };
  };

  // 边
  type Edge_t = {
    v?: Vertex_t;
    v1: Vertex_t;
    v2: Vertex_t;
  };

  // 光栅化三角形
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

  // phong 模型中的简单光照
  // 点光源
  type PhongLightPoint = {
    pos: Vector3;
    color: Vector3;
  };

  type PhongObjectMaterial = {
    lightMaterial: PhongLightMaterial;
    color: Vector3;
  };

  // phong 模型中环境光强度，漫反射强度，镜面反射强度
  type PhongLightMaterial = {
    // 反射的环境光强度
    ambientStrength: number;
    // 反射的漫反射光强度 Lambert
    diffuseStrength: number;
    // 反射的镜面反射光强度
    specularStrength: number;
    // 值越大，表面越平滑
    shininess: number;
  };

  type TickFunc = (time: number) => void;
}
