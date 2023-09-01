import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Sprite = defineComponent({
    texture: Types.ui8,
    rotation: Types.f32,
    focusX: Types.i32,
    focusY: Types.i32
});

export function addSprite(texture: number, targetX: number = -1, targetY: number = -1) : initComponent {
    return (world, entity) => {
        addComponent(world, Sprite, entity);
        Sprite.rotation[entity] = 0;
        Sprite.texture[entity] = texture;
        Sprite.focusX[entity] = targetX;
        Sprite.focusY[entity] = targetY;
    };
}

export default Sprite;
