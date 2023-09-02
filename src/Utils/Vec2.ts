
export default class Vec2 {
    public x:number;
    public y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    clone() { return new Vec2 (this.x, this.y); }

    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }

    radians() { return Math.atan2(this.x, this.y); }

    normalize() {
        const inv = 1 / this.length();
        return new Vec2(this.x * inv, this.y * inv);
    }

    squareLen() { return this.x * this.x + this.y * this.y; }

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

    clamp(maxX:number, maxY:number) {
        let x = Math.min(this.x, maxX);
        x = Math.max(x, -maxX);


        let y = Math.min(this.y, maxY);
        y = Math.max(y, -maxY);

        return new Vec2(x, y);
    }
}
