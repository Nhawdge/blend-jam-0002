import { CollisionEvent } from "../Systems/PhysicsSystems";
import createEvent from "./EventManager";


const Events = {
    collisions: createEvent<CollisionEvent>()
};

export default Events;


