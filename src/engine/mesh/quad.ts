// 屏幕上一个正方形
export const screen_quad = () => {
  const vertices = [
    -1, 1, 0, -1, -1, 0, 1, -1, 0,

    -1, 1, 0, 1, -1, 0, 1, 1, 0,
  ];
  return { vertices };
};
