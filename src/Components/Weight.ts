import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Weight = defineComponent({
    gravity: Types.f32
});

export function addWeight(gravity: number) : initComponent {
    return (world, entity) => {
        addComponent(world, Weight, entity);
        Weight.gravity[entity] = gravity;
    };
}

export default Weight;
