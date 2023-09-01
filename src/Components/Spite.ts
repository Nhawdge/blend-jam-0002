import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const Sprite = defineComponent({
    texture: Types.ui8
});

export function addSprite(texture: number) : initComponent {
    return (world, entity) => {
        addComponent(world, Sprite, entity);
        Sprite.texture[entity] = texture;
    };
}

export default Sprite;
