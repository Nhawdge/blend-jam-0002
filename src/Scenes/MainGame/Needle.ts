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

const PlayerAnimations = {
    Idle: 0
};

export default PlayerAnimations;

// Player component
const Needle = defineComponent({
    radius: Types.f32,
    speed: Types.f32,
    angle: Types.f32
});

export function spawnNeedle(world:IWorld, needleSprite:number) {
    composeEntity(
        world,
        [
            addPosition(328, 0),
            addSprite(needleSprite),
            include(Needle)
        ]
    );
}


export function needleMovementSystem() {

    const needleQuery = defineQuery([Needle, Position, Sprite]);

    return defineSystem((world) => {
        const needle = needleQuery(world).find(x => true);
        if (!needle) { return world; }

        Needle.angle[needle] += DeltaTime.get() * Needle.speed[needle];

        Position.x[needle] = Math.cos(Needle.angle[needle]) * Needle.radius[needle];
        Position.y[needle] = Math.sin(Needle.angle[needle]) * Needle.radius[needle];
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


