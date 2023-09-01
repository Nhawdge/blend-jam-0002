
export default class Vec2 {
    public x:number;
    public y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    clone() { return new Vec2 (this.x, this.y); }

    add(vec:Vec2) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    sub(vec:Vec2) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    timesScalar(scalar:number) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    times(magnitude:Vec2) {
        return new Vec2(this.x * magnitude.x, this.y * magnitude.y);
    }

    divide(magnitude:Vec2) {
        return new Vec2(this.x / magnitude.x, this.y * magnitude.y);
    }

    inv() { 
        return new Vec2(1 / this.x, 1 / this.y);
    }

    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }
}
