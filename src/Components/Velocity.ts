import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
    previousX: Types.f32,
    previousY: Types.f32
});

export function addVelocity(x: number, y: number) : initComponent {
    return (world, entity) => {
        addComponent(world, Velocity, entity);
        Velocity.x[entity] = x;
        Velocity.y[entity] = y;
        Velocity.previousX[entity] = x;
        Velocity.previousY[entity] = y;
    };
}

export default Velocity;