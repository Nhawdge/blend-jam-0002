import { defineComponent, IWorld } from "bitecs";
import { addAnimatedSprite } from "../../Components/AnimatedSprite";
import { composeEntity } from "../../Components/ComponentInitializer";
import { addPosition } from "../../Components/Position";

const PlayerAnimations = {
    Idle: 0
};

// Player component
const Player = defineComponent({

});

export function spawnPlayer(world:IWorld, playerSheet:number) {
    composeEntity(
        world,
        [
            addPosition(0, 0),
            addAnimatedSprite(playerSheet, PlayerAnimations.Idle)
        ]
    );

}


export default PlayerAnimations;


