
const NEAR = 0;
const FAR = 1;

export default class Collider {
    readonly pos: [number, number];
    readonly size: [number, number];

    constructor(pos: [number, number], size: [number, number]) {
        this.pos = pos;
        this.size = size;
    }

    getSide(axis:number, side:number) {
        return this.pos[axis] + (this.size[axis] * side);
    }

    getLength(axis:number) {
        return this.size[axis];
    }

    extend(axis:number, side:number, length:number) {
        const pos:[number, number] = [this.pos[0], this.pos[1]];
        const size:[number, number] = [this.size[0], this.size[1]];
        size[axis] += length;
        pos[axis] -= length * side;
        
        return new Collider(pos, size);
    }

    static create(x:number, y:number, width:number, height:number) {
        return new Collider([x, y], [width, height]);
    }

    checkSideCollision(other:Collider, axis:number, side:number) {
        const otherAxis = axis == 1 ? 0 : 1;

        if (this.getSide(otherAxis, NEAR) > other.getSide(otherAxis, FAR))
            return null;
        
        if (this.getSide(otherAxis, FAR) < other.getSide(otherAxis, NEAR))
            return null;

        let sideValue = this.getSide(axis, side);
        if (sideValue < other.getSide(axis, NEAR))
            return null;

        if (sideValue > other.getSide(axis, FAR))
            return null;

        const otherSide = side == 1 ? 0 : 1;
        let distance = other.getSide(axis, otherSide) - sideValue;
        return distance;
    }
}
