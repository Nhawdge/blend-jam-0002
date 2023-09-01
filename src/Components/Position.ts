import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export function addPosition(x: number, y: number) : initComponent {
    return (world, entity) => {
        addComponent(world, Position, entity);
        Position.x[entity] = x;
        Position.y[entity] = y;
    };
}

export default Position;

