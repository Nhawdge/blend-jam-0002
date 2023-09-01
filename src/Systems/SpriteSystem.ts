import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import * as PIXI from "pixi.js";
import Position from "../Components/Position";
import Sprite from "../Components/Spite";
import { IResourceMap } from "../IResourceMap";
import constants from "../constants";


const map = new Map<number, PIXI.Sprite>();
const spriteQuery = defineQuery([Sprite, Position]);
const spriteExitQuery = exitQuery(spriteQuery);


export function spawnSprites(
    textures: IResourceMap<PIXI.Texture>,
    container: PIXI.Container
) {
    const query = enterQuery(spriteQuery);

    return defineSystem((world) => {
        const entities = query(world);
        for (const entity of entities) {
            const texture_id = Sprite.texture[entity];
            const texture = textures.get(texture_id);
            const sprite = PIXI.Sprite.from(texture);

            sprite.x = Position.x[entity];
            sprite.y = Position.y[entity];
            sprite.anchor.set(0.5);
            sprite.angle = Sprite.angle[entity];
            
            sprite.tint = new PIXI.Color(constants.NOTES.find(x => x.ID == Sprite.tint[entity])?.COLOR || 0xFFFFFF);
            console.log(sprite);
            
            container.addChild(sprite);
            
            map.set(entity, sprite);
        }

        return world;
    });
}

export function updateSprites() {
    return defineSystem((world) => {
        for (let entity of spriteQuery(world)) {
            const sprite = map.get(entity);
            if (!sprite) { continue; }

            sprite.x = Position.x[entity];
            sprite.y = Position.y[entity];
            sprite.angle = Sprite.angle[entity];
            sprite.tint = Sprite.tint[entity];
        }

        return world;
    });
}

export function despawnSprites(
    container: PIXI.Container
) {

    return defineSystem((world) => {
        const entities = spriteExitQuery(world);
        
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
