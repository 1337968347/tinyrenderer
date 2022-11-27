const createCanvasRenderingContext2D = ({ width = 500, height = 500 }) => {
  const canvasEl = document.querySelector('canvas') || document.createElement('canvas');
  canvasEl.width = width;
  canvasEl.height = height;

  const ctx = canvasEl.getContext('2d');
  return ctx;
};

export { createCanvasRenderingContext2D };
