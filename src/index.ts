import { renderLine, renderCoor } from '../src/geometry';

const width = 500;
const height = 500;
const canvasEl = document.querySelector('canvas') || document.createElement('canvas');
canvasEl.width = width;
canvasEl.height = height;

const ctx = canvasEl.getContext('2d');
renderCoor(ctx, width, height);
const imageData = ctx.getImageData(0, 0, width, height);

renderLine(0, 0, -200, 200, imageData);
renderLine(0, 0, 200, 200, imageData);
renderLine(0, 0, 200, -200, imageData);
renderLine(0, 0, -200, -200, imageData);
renderLine(0, 0, 0, -200, imageData);

ctx.putImageData(imageData, 0, 0);
