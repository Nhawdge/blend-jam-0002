import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Needle = defineComponent({
    radius: Types.f32,
    loopDuration: Types.f32,
    angle: Types.f32,
    currentTime: Types.f32
});

export function addNeedle() : initComponent {
    return (world, entity) => {
        addComponent(world, Needle, entity);
        Needle.radius[entity] = 328;
        Needle.loopDuration[entity] = 16000;
        Needle.currentTime[entity] = 0;
    };
}

export default Needle;