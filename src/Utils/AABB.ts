import Vec2 from "./Vec2";

export default class AABB {
    public pos:Vec2;
    public size:Vec2;

    constructor(pos:Vec2, size:Vec2) {
        this.pos = pos;
        this.size = size;
    }

    static create(x:number, y:number, width:number, height:number) {
        return new AABB(
            new Vec2(x, y),
            new Vec2(width, height)
        );
    }

    static signum(val:number) {
        // Stupid hack because Math.sign returns +0 for both +0 and -0. We want -1 or +1.
        if (val === 0 && 1 / val === -Infinity) {
            return -1;
        }
        return val < 0 ? -1 : 1;
    }

    detectRayCollision(pos:Vec2, ray:Vec2) {
        const raySign = new Vec2(AABB.signum(ray.x), AABB.signum(ray.y));
        const negRaySign = raySign.timesScalar(-1);

        const nearSide = this.pos.add(this.size.times(negRaySign));
        const farSide = this.pos.add(this.size.times(raySign));

        const nearDistance = nearSide.sub(pos);
        const farDistance = farSide.sub(pos);

        const rayInvert = ray.inv();
        const nearImpact = nearDistance.times(rayInvert);
        const farImpact = farDistance.times(rayInvert);

        if (nearImpact.x > farImpact.y || nearImpact.y > farImpact.x) { 
            return null; 
        }

        const impactMoment = Math.max(nearImpact.x, nearImpact.y);
        const exitMoment = Math.min(farImpact.x, farImpact.y);

        if (impactMoment > 1 || impactMoment <= 0) { return null; }
        if (impactMoment > exitMoment) { return null; }

        const reflection = ray.timesScalar(1 - impactMoment);

        const normal = nearImpact.x <= nearImpact.y
            ? new Vec2(0, -raySign.y)
            : new Vec2(-raySign.x, 0);

        const pointOfImpact = pos.add(reflection);
        const output = {
            point: pointOfImpact,
            normal,
            moment: impactMoment
        };

        return output;
    }

}