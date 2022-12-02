import { vertPipeline, trangleMakePipeline, croppingPipeline, rasterizationPipeline, fragPipeline } from '../engine/pipeline';

// type SceneProps = {
//   attributes: , uniforms, width, height, vertShader, fragShader, canvas
// }

/**
 * 引擎
 * @param param0
 * @returns
 */
export const Render2FrameBufferData = ({ attributes, uniforms, vertShader, fragShader, frameBufferData }) => {
  const { width, height, data } = frameBufferData;
  const zBuffer = new Float32Array(width * height);

  const draw = uniforms => {
    data.fill(0);
    // 顶点着色器
    const { varyings, gl_positions } = vertPipeline(attributes, uniforms, vertShader);
    // 图元组装
    const { primitiveVaryingData, primitiveGlPosition } = trangleMakePipeline(varyings, gl_positions);
    // 裁剪处理 (背面剔除, 视锥体剔除)
    croppingPipeline(primitiveVaryingData, primitiveGlPosition);
    // 光栅化（图元数据 => 片元数据）
    const fragmentData = rasterizationPipeline({ varyingData: primitiveVaryingData, glPosition: primitiveGlPosition, width: width, height: height, zBuffer });
    fragPipeline(fragmentData, data, fragShader, width, height);
  };

  draw(uniforms);
  return { draw };
};
