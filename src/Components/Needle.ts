import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";
import { TOTAL_TIME } from '../Resources/ToneTiming';

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
        Needle.loopDuration[entity] = TOTAL_TIME * 1000;
        Needle.currentTime[entity] = 0;
    };
}

export default Needle;