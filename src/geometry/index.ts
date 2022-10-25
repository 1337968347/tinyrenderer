
class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


class Line {
    sp: Vector;
    ep: Vector;
    constructor(sp: Vector, ep: Vector) {
        this.sp = sp;
        this.ep = ep;
    }

}


const renderLine = (x0: number, y0: number, x1: number, y1: number, imageData: ImageData) => {
    const { data, width, height } = imageData
    // x0 += (width / 2) | 0;
    // x1 += (width / 2) | 0;
    // y0 += (height / 2) | 0
    // y1 += (height / 2) | 0
    // y0 *= -1;
    // y1 *= -1;
    const deltaX = x1 - x0;
    const deltaY = y1 - y0;
    let error = 0;
    let deltaErr = deltaY / deltaX;
    let y = y0;
    const plot = (x: number, y: number) => {

        x += (width / 2) | 0;
        y += (height / 2) | 0
        let index = (y | 0) * width + (x | 0);
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 255;
    }
    for (let x = x0; x < x1; x++) {

        plot(x, y)
        error += deltaErr;
        if (Math.abs(error) >= 0.5) {
            y += 1;
            error -= 1;
        }
    }
}

export { Line, Vector, renderLine }