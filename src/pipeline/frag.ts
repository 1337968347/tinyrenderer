import { FragmentData } from './rasterization';

const fragPipeline = (fragmentData: FragmentData[], imageData: ImageData, width: number, height: number) => {
  for (let i = 0; i < fragmentData.length; i++) {
    const fragmentItem = fragmentData[i];
    if (!fragmentItem.isHit) continue;
    const { x, y } = fragmentItem;
    imageData.data[y * width + x * 4 + 3] = 255;
  }
  return imageData;
};

export { fragPipeline };
