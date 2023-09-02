import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";
import ToneTiming from '../Resources/ToneTiming';

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
        Needle.loopDuration[entity] = ToneTiming.TOTAL_TIME;
        Needle.currentTime[entity] = 0;
    };
}

export default Needle;