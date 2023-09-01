import { defineComponent, defineQuery, defineSystem, IWorld } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity, include } from "../../Components/ComponentInitializer";
import Position, { addPosition } from "../../Components/Position";
import Velocity, { addVelocity } from "../../Components/Velocity";
import keys from '../../Resources/KeysResource';
import Vec2 from "../../Utils/Vec2";
import consts from '../../constants';

const PlayerAnimations = {
    Idle: 0
};

export default PlayerAnimations;

// Player component
const Player = defineComponent({

});

export function spawnPlayer(world:IWorld, playerSheet:number) {
    composeEntity(
        world,
        [
            addPosition(0, 0),
            addVelocity(0, 0),
            addAnimatedSprite(playerSheet, PlayerAnimations.Idle),
            include(Player)
        ]
    );
}


export function playerMovementSystem() {

    const playerQuery = defineQuery([Player, Velocity]);

    return defineSystem((world) => {
        const player = playerQuery(world).find(x => true);
        if (!player) { return world; }

        let velocityAdjustment = new Vec2(0, 0);

        if (keys.isKeyDown('a') || keys.isKeyDown('ArrowLeft'))
            velocityAdjustment.x -= consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('d') || keys.isKeyDown('ArrowRight'))
            velocityAdjustment.x += consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('w') || keys.isKeyDown('ArrowUp'))
            velocityAdjustment.y -= consts.PLAYER_ACCELERATION;
        if (keys.isKeyDown('s') || keys.isKeyDown('ArrowDown'))
            velocityAdjustment.y += consts.PLAYER_ACCELERATION;

        let newVelocity = new Vec2(
            Velocity.x[player],
            Velocity.y[player]
        );
        if (velocityAdjustment.x === 0 && velocityAdjustment.y === 0) {
            newVelocity = newVelocity.timesScalar(consts.PLAYER_DRAG);
        } else {
            newVelocity = newVelocity.add(velocityAdjustment);
        }

        newVelocity = newVelocity
            .clamp(consts.MAX_PLAYER_SPEED, consts.MAX_PLAYER_SPEED);

        Velocity.x[player] = newVelocity.x;
        Velocity.y[player] = newVelocity.y;

        return world;
    })
}


