import { addComponent, defineComponent, Types } from "bitecs";
import { initComponent } from "./ComponentInitializer";

const AnimatedSprite = defineComponent({
    sheetId: Types.i8,
    animationId: Types.i8,
    previousAnimationId: Types.i8,
});

export function addAnimatedSprite(sheetId: number, initialAnimation:number) : initComponent {
    return (world, entity) => {
        addComponent(world, AnimatedSprite, entity);
        AnimatedSprite.sheetId[entity] = sheetId;
        AnimatedSprite.animationId[entity] = initialAnimation;
        AnimatedSprite.previousAnimationId[entity] = 0;
    }
}


export default AnimatedSprite;