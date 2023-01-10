// 透视除法
const divisionPipeline: DivisionPipeline = position => {
  for (let i = 0; i < position.length; i++) {
    position[i].divideScalar(position[i].w);
  }
};

export { divisionPipeline };
