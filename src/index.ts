import { renderLine } from "../src/geometry"

const canvasEl = document.querySelector("canvas") || document.createElement('canvas')
canvasEl.width = 500;
canvasEl.height = 500;

const ctx = canvasEl.getContext('2d')
const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)

renderLine(0, 0, 100, 100, imageData)
ctx.putImageData(imageData, 0, 0)