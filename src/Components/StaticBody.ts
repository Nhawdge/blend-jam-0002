import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const StaticBody = defineComponent({
    width: Types.f32,
    height: Types.f32
});

export function addStaticBody(width: number, height: number) : initComponent {
    return (world, entity) => {
        addComponent(world, StaticBody, entity);
        StaticBody.width[entity] = width;
        StaticBody.height[entity] = height;
    };
}

export default StaticBody;
