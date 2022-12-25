class Clock {
  isRunning: boolean = false;
  nowT: number;
  timeId: NodeJS.Timeout | null = null;
  onTick: TickFunc;

  constructor() {}

  start() {
    this.isRunning = true;
    this.nowT = new Date().getTime();
    const intervalRequest = func => {
      this.timeId = setTimeout(func, 16);
    };
    const loopFunc = window.requestAnimationFrame || intervalRequest;
    const f = () => {
      if (this.isRunning) {
        this.tick();
        loopFunc(f);
      }
    };
    loopFunc(f);
    this.tick();
  }

  stop() {
    this.isRunning = false;
    if (this.timeId) {
      clearInterval(this.timeId);
      this.timeId = null;
    }
  }

  tick() {
    const t = this.nowT;
    this.nowT = new Date().getTime();
    this.onTick && this.onTick((this.nowT - t) / 1000);
  }

  setOnTick(onTick: TickFunc) {
    this.onTick = onTick;
  }
}

export { Clock };
