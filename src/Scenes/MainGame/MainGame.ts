import * as PIXI from 'pixi.js';
import { composeEntity, include } from '../../Components/ComponentInitializer';
import { addPosition } from '../../Components/Position';
import { addSprite } from '../../Components/Spite';
import createResourceMap from "../../IResourceMap";
import { despawnSprites, spawnSprites, updateSprites } from '../../Systems/SpriteSystem';
import IGameContext from '../GameContext';
import { SceneBuilder } from "../SceneManager";


export default async function mainGameScene() : Promise<SceneBuilder> {
    const textures = createResourceMap<PIXI.Texture>();
    const bg = textures.add(await PIXI.Assets.load('assets/game-background.png') as PIXI.Texture);


    return ({ world, container }: IGameContext) => {
        composeEntity(
            world,
            [
                addPosition(0, 0),
                addSprite(bg)
            ]
        );

        return [
            spawnSprites(textures, container),

            updateSprites(),
            despawnSprites(container)
        ];


        return [];
    }
}
