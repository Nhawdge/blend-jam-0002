import { defineComponent, defineQuery, defineSystem, IWorld, Types } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity, include } from "../../Components/ComponentInitializer";
import Position, { addPosition } from "../../Components/Position";
import Velocity, { addVelocity } from "../../Components/Velocity";
import keys from '../../Resources/KeysResource';
import Vec2 from "../../Utils/Vec2";
import consts from '../../constants';
import Sprite, { addSprite } from "../../Components/Spite";
import DeltaTime from "../../Resources/DeltaTime";
import Needle, { addNeedle } from "../../Components/Needle";

const PlayerAnimations = {
    Idle: 0
};

export default PlayerAnimations;


export function spawnNeedle(world:IWorld, needleSprite:number) {
    composeEntity(
        world,
        [
            addPosition(328, 0),
            addSprite(needleSprite),
            addNeedle()
        ]
    );
}


export function needleMovementSystem() {

    const needleQuery = defineQuery([Needle, Position, Sprite]);

    return defineSystem((world) => {
        const needle = needleQuery(world).find(x => true);
        if (!needle) { return world; }
        Needle.currentTime[needle] += DeltaTime.get();
        var duration = Needle.loopDuration[needle];
        var segments = duration / 360;
        var timePercent = Needle.currentTime[needle] / duration;
        Needle.angle[needle] = segments * timePercent;
        
        
        console.log({currentTime: Needle.currentTime[needle],
            duration,
            segments,
            timePercent,
            angle: Needle.angle[needle], 
            delta: DeltaTime.get()})

        //Needle.angle[needle] += (DeltaTime.get() / 1000) * Needle.speed[needle];

        Sprite.angle[needle] = Needle.angle[needle];

        var angleAsDegrees = Needle.angle[needle] * 180 / Math.PI;

        var newX = Math.cos(angleAsDegrees) * Needle.radius[needle];
        var newY = Math.sin(angleAsDegrees) * Needle.radius[needle];
        
        Position.x[needle] = newX;
        Position.y[needle] = newY;
        console.log(newX, newY);
        console.log("Test");


        // let velocityAdjustment = new Vec2(0, 0);

        // let newVelocity = new Vec2(
        //     Velocity.x[player],
        //     Velocity.y[player]
        // );
        // if (velocityAdjustment.x === 0 && velocityAdjustment.y === 0) {
        //     newVelocity = newVelocity.timesScalar(consts.PLAYER_DRAG);
        // } else {
        //     newVelocity = newVelocity.add(velocityAdjustment);
        // }

        // newVelocity = newVelocity
        //     .clamp(consts.MAX_PLAYER_SPEED, consts.MAX_PLAYER_SPEED);

        
        


        return world;
    })
}


