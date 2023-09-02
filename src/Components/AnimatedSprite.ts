import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const AnimatedSprite = defineComponent({
    sheetId: Types.i8,
    animationId: Types.i8,
    previousAnimationId: Types.i8,
    tint: Types.f32,
});

export function addAnimatedSprite(sheetId: number, initialAnimation:number, tint?:number | undefined) : initComponent {
    return (world, entity) => {
        addComponent(world, AnimatedSprite, entity);
        AnimatedSprite.sheetId[entity] = sheetId;
        AnimatedSprite.animationId[entity] = initialAnimation;
        AnimatedSprite.previousAnimationId[entity] = 0;
        AnimatedSprite.tint[entity] = tint || -1;
    }
}


export default AnimatedSprite;