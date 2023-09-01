import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const KineticBody = defineComponent({
    width: Types.f32, // Width/height is half the full width. Distance from center to edge.
    height: Types.f32,
    grounded: Types.ui8, // 0 = false, anything else = true
    wasGrounded: Types.ui8, // If the player was grounded last frame
});

export function addKineticBody(width: number, height: number) : initComponent {
    return (world, entity) => {
        addComponent(world, KineticBody, entity);
        KineticBody.width[entity] = width;
        KineticBody.height[entity] = height;
        KineticBody.grounded[entity] = 0;
        KineticBody.wasGrounded[entity] = 0;
    };
}

export default KineticBody;
