import {  defineQuery, defineSystem, IWorld } from "bitecs";
import { composeEntity } from "../../Components/ComponentInitializer";
import Position, { addPosition } from "../../Components/Position";
import Sprite, { addSprite } from "../../Components/Spite";
import Needle, { addNeedle } from "../../Components/Needle";
import ToneTiming from "../../Resources/ToneTiming";

const PlayerAnimations = {
    Idle: 0
};

export default PlayerAnimations;


export function spawnNeedle(world: IWorld, needleSprite: number) {
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

        // Needle.currentTime[needle] += DeltaTime.get();
        // var duration = Needle.loopDuration[needle];
        // var timePercent = Needle.currentTime[needle] / duration;

        const angle = 360 * (ToneTiming.getPercent() - 0.25);
        Needle.angle[needle] = angle;
        Sprite.angle[needle] = angle;


        var angleInRadians = angle / 180 * Math.PI;

        var newX = Math.cos(angleInRadians) * Needle.radius[needle];
        var newY = Math.sin(angleInRadians) * Needle.radius[needle];

        Position.x[needle] = newX;
        Position.y[needle] = newY;

        return world;
    })
}


