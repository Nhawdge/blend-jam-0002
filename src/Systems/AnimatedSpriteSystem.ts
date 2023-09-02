import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import * as PIXI from "pixi.js";
import AnimatedSprite from "../Components/AnimatedSprite";
import Position from "../Components/Position";
import { IResourceMap } from "../IResourceMap";

const map = new Map<number, PIXI.AnimatedSprite>();
const allSheetsQuery = defineQuery([AnimatedSprite, Position]);

export function spawnAnimatedSprites(
    sheets: IResourceMap<PIXI.Spritesheet>,
    animations: IResourceMap<string>,
    container: PIXI.Container
) {
    const query = enterQuery(allSheetsQuery);

    return defineSystem((world) => {
        const entities = query(world);
        for (const entity of entities) {
            const sheet = sheets.get(AnimatedSprite.sheetId[entity]);
            const animation = animations.get(AnimatedSprite.animationId[entity]);
            const texture = sheet.animations[animation];

            const sprite = new PIXI.AnimatedSprite(texture);
            sprite.play();
            sprite.animationSpeed = 0.15;
            AnimatedSprite.previousAnimationId[entity] = AnimatedSprite.animationId[entity];

            sprite.x = Position.x[entity];
            sprite.y = Position.y[entity];
            sprite.anchor.set(0.5);

            const tint = AnimatedSprite.tint[entity];
            if (tint > 0) {
                sprite.tint = tint;
            }

            container.addChild(sprite);
            
            map.set(entity, sprite);
        }
        return world;
    });
}


export function updateAnimatedSprites(
    sheets: IResourceMap<PIXI.Spritesheet>,
    animations: IResourceMap<string>,
) {
    return defineSystem((world) => {
        for (let entity of allSheetsQuery(world)) {
            const sprite = map.get(entity);
            if (!sprite) { continue; }

            sprite.x = Position.x[entity];
            sprite.y = Position.y[entity];
            const tint = AnimatedSprite.tint[entity];
            if (tint > 0) {
                sprite.tint = tint;
            }


            const animationId = AnimatedSprite.animationId[entity];
            const previous = AnimatedSprite.previousAnimationId[entity];
            if (animationId != previous) {
                AnimatedSprite.previousAnimationId[entity] = animationId;

                const sheet = sheets.get(AnimatedSprite.sheetId[entity]);
                const animation = animations.get(AnimatedSprite.animationId[entity]);
                const texture = sheet.animations[animation];

                sprite.textures = texture;
                sprite.play();
            }
        }

        return world;
    });
}

export function despawnAnimatedSprites(
    container: PIXI.Container
) {
    const exitSheets = exitQuery(allSheetsQuery);

    return defineSystem((world) => {
        const entities = exitSheets(world);
        
        for (const entity of entities) {
            
            const sprite = map.get(entity);
            if (!sprite) { continue; }
            
            let removed = container.removeChild(sprite);

            sprite.destroy({
                children: true,
            })
            map.delete(entity);
        }

        return world;
    });
}
