import { AxeHitEvent } from "../Scenes/MainGame/Player";
import { CollisionEvent } from "../Systems/PhysicsSystems";
import createEvent from "./EventManager";


const Events = {
    collisions: createEvent<CollisionEvent>(),
    axeHits: createEvent<AxeHitEvent>(),
    tickAll: function() {
        this.collisions.tick();
        this.axeHits.tick();
    }
};

export default Events;


