import { Vector4 } from 'three';

// 屏幕上一个正方形
export const screen_quad = () => {
  const position = [
    new Vector4(-1, 1, 0, 1.0),
    new Vector4(-1, -1, 0, 1.0),
    new Vector4(1, -1, 0, 1.0),

    new Vector4(-1, 1, 0, 1.0),
    new Vector4(1, -1, 0, 1.0),
    new Vector4(1, 1, 0, 1.0),
  ];
  return { position };
};
