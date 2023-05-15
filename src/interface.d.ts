import { Matrix4, Vector2, Vector3, Vector4 } from 'three';
import { Trangle } from '../src/engine/geometry';
import { Texture2D } from './engine/geometry/texture';
declare global {
  type attributeProp = { [key: string]: Vector4 };
  // 图元
  type AttributeProps = { position?: Vector4[];[key: string]: Vector4[] };
  type uniformsProp = { model?: Matrix4;[key: string]: Vector4 | number | Matrix4 | Texture2D | Vector3 | any };
  // 图元数据
  type PrimitiveData = { [key: string]: Trangle[] };

  type VertShader = (attribute: attributeProp, uniforms: uniformsProp, varyings: AttributeProps, gl_position: Vector4) => void;

  type FragContext = {
    gl_FragColor: GL_FragColor,
    fragCoord: { x: number, y: number },
    iResolution: { x: number, y: number }
  }

  type FragShader = (vary: Vertex_t, uniforms: uniformsProp, fragContext: FragContext) => void;

  type VertPipeline = (props: { attributes: AttributeProps; uniforms: uniformsProp; vertShader: VertShader }) => Vertex_t[];

  type rasterizationPipelineProps = {
    verts: Vertex_t[];
    frameBufferData: FrameBufferData;
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
    // 基于重心坐标插值的各种数据
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

  // 帧缓冲数据
  type FrameBufferData = {
    color: ImageData;
    zBuffer: Float32Array;
    // 模板测试
    stencil?: Uint8ClampedArray;
  }

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

  type RenderState = {
    // 使用背面剔除
    'use-backCull': boolean;
    // 使用CVV裁剪
    'use-cvvCull': boolean;
  }
}
